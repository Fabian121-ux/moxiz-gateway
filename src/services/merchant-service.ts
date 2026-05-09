
/**
 * @fileOverview Business logic for Merchant management.
 */

import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Merchant } from '@/lib/types';
import { ApiKeyService } from './api-key-service';
import { TransactionService } from './transaction-service';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export class MerchantService {
  /**
   * Ensures a merchant profile exists in Firestore.
   * If it doesn't, creates a new one and seeds demo data.
   */
  static async ensureMerchantProfile(db: Firestore, userId: string, email: string): Promise<Merchant> {
    const merchantRef = doc(db, 'merchants', userId);
    
    try {
      const snap = await getDoc(merchantRef);

      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Merchant;
      }
    } catch (e: any) {
      // If we are offline or get a connection error, throw a controlled error or return a mock
      if (e.code === 'unavailable' || e.message?.includes('offline')) {
        console.warn("Firestore unavailable, falling back to mock profile.");
        return {
          id: userId,
          businessName: email === 'demo@moxiz.dev' ? 'Moxiz Demo Corp' : 'My Business',
          email,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        } as Merchant;
      }
      throw e;
    }

    const businessName = email === 'demo@moxiz.dev' ? 'Moxiz Demo Corp' : 'My Business';
    
    const newMerchant: Omit<Merchant, 'id'> = {
      businessName,
      email,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    // Use non-blocking setDoc
    setDoc(merchantRef, newMerchant, { merge: true })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: merchantRef.path,
          operation: 'write',
          requestResourceData: newMerchant
        }));
      });

    // If it's a demo user, seed initial data
    if (email === 'demo@moxiz.dev') {
      this.seedDemoData(db, userId);
    } else {
      // Every merchant needs at least one API key to start
      ApiKeyService.generateKey(db, userId, 'Default Test Key', 'TEST');
    }

    return { id: userId, ...newMerchant } as Merchant;
  }

  private static seedDemoData(db: Firestore, userId: string) {
    // Generate initial infrastructure in background
    ApiKeyService.generateKey(db, userId, 'Sandbox Legacy Key', 'TEST');
    ApiKeyService.generateKey(db, userId, 'Main Production Key', 'LIVE');

    const demoTransactions = [
      { amount: 25000, customerName: 'Marcus Engineer', customerEmail: 'dev.lead@startup.io', status: 'SUCCESS' as const },
      { amount: 1250, customerName: 'Alex Riviera', customerEmail: 'alex@cloud-services.net', status: 'FAILED' as const },
      { amount: 89000, customerName: 'Enterprise Billing', customerEmail: 'billing@enterprise.com', status: 'SUCCESS' as const },
      { amount: 3200, customerName: 'Jane Smith', customerEmail: 'jane.smith@design.co', status: 'PENDING' as const },
    ];

    demoTransactions.forEach(tx => {
      TransactionService.createTransaction(db, userId, tx);
    });
  }

  static async updateMerchant(db: Firestore, id: string, data: Partial<Merchant>): Promise<void> {
    const merchantRef = doc(db, 'merchants', id);
    setDoc(merchantRef, data, { merge: true })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: merchantRef.path,
          operation: 'update',
          requestResourceData: data
        }));
      });
  }
}
