
import { Firestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Transaction, TransactionStatus, Environment } from '@/lib/types';
import { WebhookService } from './webhook-service';
import { RequestLogService } from './request-log-service';

export class TransactionService {
  static async createTransaction(
    db: Firestore, 
    merchantId: string, 
    data: Partial<Transaction>,
    env: Environment = 'SANDBOX'
  ): Promise<void> {
    const txRef = collection(db, 'merchants', merchantId, 'transactions');
    const reference = `MOX-${Math.floor(100000 + Math.random() * 900000)}`;
    const latency = Math.floor(80 + Math.random() * 200);
    
    const newTx = {
      reference,
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      status: data.status || 'PENDING',
      customerEmail: data.customerEmail || 'customer@example.com',
      customerName: data.customerName || 'Anonymous Customer',
      paymentMethod: data.paymentMethod || 'card',
      metadata: data.metadata || {},
      environment: env,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(txRef, newTx);

    // Simulated API Request Logging
    await RequestLogService.logRequest(db, merchantId, {
      method: 'POST',
      path: '/v1/payments',
      statusCode: 201,
      latencyMs: latency,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Moxiz-SDK/1.0.4 Node/20.0.0',
      requestPayload: { amount: newTx.amount, currency: newTx.currency },
      responsePayload: { id: docRef.id, reference: newTx.reference, status: newTx.status },
      environment: env
    });

    // Trigger initial webhook
    await WebhookService.logEvent(db, merchantId, {
      eventType: 'transaction.created',
      payload: { transactionId: docRef.id, reference, status: newTx.status },
      environment: env
    });
  }

  static async updateStatus(
    db: Firestore,
    merchantId: string,
    transactionId: string,
    status: TransactionStatus,
    env: Environment
  ): Promise<void> {
    const docRef = doc(db, 'merchants', merchantId, 'transactions', transactionId);
    
    await setDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    await WebhookService.logEvent(db, merchantId, {
      eventType: `transaction.${status.toLowerCase()}`,
      payload: { transactionId, status },
      environment: env
    });
  }
}
