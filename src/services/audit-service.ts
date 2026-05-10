
import { Firestore, collection, addDoc } from 'firebase/firestore';
import { AuditLog, Environment } from '@/lib/types';

export class AuditService {
  static async logAction(
    db: Firestore,
    merchantId: string,
    data: {
      action: string;
      actor: string;
      category: AuditLog['category'];
      environment: Environment;
      metadata?: any;
    }
  ): Promise<void> {
    const auditRef = collection(db, 'merchants', merchantId, 'auditLogs');
    const mockIp = `192.168.1.${Math.floor(Math.random() * 255)}`;
    
    await addDoc(auditRef, {
      ...data,
      ip: mockIp,
      createdAt: new Date().toISOString()
    });
  }
}
