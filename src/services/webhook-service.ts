
import { Firestore, collection, addDoc } from 'firebase/firestore';
import { WebhookEvent } from '@/lib/types';

export class WebhookService {
  static async logEvent(
    db: Firestore,
    merchantId: string,
    data: { eventType: string; payload: any }
  ): Promise<void> {
    const webhooksRef = collection(db, 'merchants', merchantId, 'webhooks');
    
    const isSuccess = Math.random() > 0.1; // 90% success simulation

    const event: Omit<WebhookEvent, 'id'> = {
      eventType: data.eventType,
      payload: data.payload,
      status: isSuccess ? 'SENT' : 'FAILED',
      retryCount: isSuccess ? 0 : Math.floor(Math.random() * 3),
      responseStatus: isSuccess ? 200 : 500,
      responseData: isSuccess ? '{"received": true}' : 'Internal Server Error',
      createdAt: new Date().toISOString(),
    };

    addDoc(webhooksRef, event);
  }

  static async replayWebhook(
    db: Firestore,
    merchantId: string,
    event: WebhookEvent
  ): Promise<void> {
    this.logEvent(db, merchantId, {
      eventType: event.eventType,
      payload: event.payload
    });
  }
}
