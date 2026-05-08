
import { Firestore, collection, doc, setDoc, serverTimestamp, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { Transaction, TransactionStatus } from '@/lib/types';
import { WebhookService } from './webhook-service';

export class TransactionService {
  static async createTransaction(
    db: Firestore, 
    merchantId: string, 
    data: Partial<Transaction>
  ): Promise<string> {
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

    const docRef = await addDoc(txRef, newTx);
    
    // Trigger initial webhook
    WebhookService.logEvent(db, merchantId, {
      eventType: 'transaction.created',
      payload: { transactionId: docRef.id, reference, status: newTx.status }
    });

    return docRef.id;
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
    }, { merge: true });

    // Trigger status change webhook
    WebhookService.logEvent(db, merchantId, {
      eventType: `transaction.${status.toLowerCase()}`,
      payload: { transactionId, status }
    });
  }
}
