
import { Firestore, collection, addDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { RequestLog, Environment } from '@/lib/types';

export class RequestLogService {
  static async logRequest(
    db: Firestore,
    merchantId: string,
    data: Omit<RequestLog, 'id' | 'createdAt'>
  ): Promise<void> {
    const logsRef = collection(db, 'merchants', merchantId, 'requestLogs');
    await addDoc(logsRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  static getLogsQuery(db: Firestore, merchantId: string, env: Environment) {
    return query(
      collection(db, 'merchants', merchantId, 'requestLogs'),
      where('environment', '==', env),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }
}
