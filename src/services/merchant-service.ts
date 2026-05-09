
/**
 * @fileOverview Business logic for Merchant management.
 */

import { Firestore, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Merchant } from '@/lib/types';
import { ApiKeyService } from './api-key-service';
import { TransactionService } from './transaction-service';

export class MerchantService {
  /**
   * Ensures a merchant profile exists in Firestore.
   * If it doesn't, creates a new one and seeds demo data.
   */
  static async ensureMerchantProfile(db: Firestore, userId: string, email: string): Promise<Merchant> {
    const merchantRef = doc(db, 'merchants', userId);
    const snap = await getDoc(merchantRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Merchant;
    }

    const businessName = email === 'demo@moxiz.dev' ? 'Moxiz Demo Corp' : 'My Business';
    
    const newMerchant: Omit<Merchant, 'id'> = {
      businessName,
      email,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    await setDoc(merchantRef, newMerchant);

    // If it's a demo user, seed initial data
    if (email === 'demo@moxiz.dev') {
      await this.seedDemoData(db, userId);
    } else {
      // Every merchant needs at least one API key to start
      await ApiKeyService.generateKey(db, userId, 'Default Test Key', 'TEST');
    }

    return { id: userId, ...newMerchant } as Merchant;
  }

  private static async seedDemoData(db: Firestore, userId: string) {
    // 1. Generate API Keys
    await ApiKeyService.generateKey(db, userId, 'Sandbox Legacy Key', 'TEST');
    await ApiKeyService.generateKey(db, userId, 'Main Production Key', 'LIVE');

    // 2. Generate initial transactions
    const demoTransactions = [
      { amount: 25000, customerName: 'Marcus Engineer', customerEmail: 'dev.lead@startup.io', status: 'SUCCESS' as const },
      { amount: 1250, customerName: 'Alex Riviera', customerEmail: 'alex@cloud-services.net', status: 'FAILED' as const },
      { amount: 89000, customerName: 'Enterprise Billing', customerEmail: 'billing@enterprise.com', status: 'SUCCESS' as const },
      { amount: 3200, customerName: 'Jane Smith', customerEmail: 'jane.smith@design.co', status: 'PENDING' as const },
    ];

    for (const tx of demoTransactions) {
      await TransactionService.createTransaction(db, userId, tx);
    }
  }

  static async updateMerchant(db: Firestore, id: string, data: Partial<Merchant>): Promise<void> {
    const merchantRef = doc(db, 'merchants', id);
    await setDoc(merchantRef, data, { merge: true });
  }
}
