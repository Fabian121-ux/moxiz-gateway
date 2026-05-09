
import { Firestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { Transaction, TransactionStatus } from '@/lib/types';
import { WebhookService } from './webhook-service';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export class TransactionService {
  static async createTransaction(
    db: Firestore, 
    merchantId: string, 
    data: Partial<Transaction>
  ): Promise<void> {
    const txRef = collection(db, 'merchants', merchantId, 'transactions');
    const reference = `MOX-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newTx = {
      reference,
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      status: data.status || 'PENDING',
      customerEmail: data.customerEmail || 'customer@example.com',
      customerName: data.customerName || 'Anonymous Customer',
      paymentMethod: data.paymentMethod || 'card',
      metadata: data.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDoc(txRef, newTx)
      .then((docRef) => {
        // Trigger initial webhook
        WebhookService.logEvent(db, merchantId, {
          eventType: 'transaction.created',
          payload: { transactionId: docRef.id, reference, status: newTx.status }
        });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: txRef.path,
          operation: 'create',
          requestResourceData: newTx
        }));
      });
  }

  static async updateStatus(
    db: Firestore,
    merchantId: string,
    transactionId: string,
    status: TransactionStatus
  ): Promise<void> {
    const docRef = doc(db, 'merchants', merchantId, 'transactions', transactionId);
    
    setDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true })
      .then(() => {
        // Trigger status change webhook
        WebhookService.logEvent(db, merchantId, {
          eventType: `transaction.${status.toLowerCase()}`,
          payload: { transactionId, status }
        });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status }
        }));
      });
  }
}
