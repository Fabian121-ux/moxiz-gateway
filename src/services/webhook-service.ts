
import { Firestore, collection, addDoc } from 'firebase/firestore';
import { WebhookEvent, Environment } from '@/lib/types';

export class WebhookService {
  static async logEvent(
    db: Firestore,
    merchantId: string,
    data: { eventType: string; payload: any; environment: Environment }
  ): Promise<void> {
    const webhooksRef = collection(db, 'merchants', merchantId, 'webhooks');
    
    const isSuccess = Math.random() > 0.05; // 95% success simulation
    const duration = Math.floor(150 + Math.random() * 400);

    const event: Omit<WebhookEvent, 'id'> = {
      eventType: data.eventType,
      payload: data.payload,
      status: isSuccess ? 'SENT' : 'FAILED',
      retryCount: isSuccess ? 0 : 1,
      responseStatus: isSuccess ? 200 : 502,
      responseData: isSuccess ? '{"received": true}' : 'Bad Gateway',
      durationMs: duration,
      environment: data.environment,
      createdAt: new Date().toISOString(),
    };

    await addDoc(webhooksRef, event);
  }
}
