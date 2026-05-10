
import { Firestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ApiKey, ApiKeyScope, Environment } from '@/lib/types';
import { AuditService } from './audit-service';

export class ApiKeyService {
  static async generateKey(
    db: Firestore,
    merchantId: string,
    name: string,
    env: Environment = 'SANDBOX',
    scopes: ApiKeyScope[] = ['payments.read', 'payments.write']
  ): Promise<void> {
    const keysRef = collection(db, 'merchants', merchantId, 'apiKeys');
    
    const randomStr = (len: number) => Math.random().toString(36).substring(2, 2 + len);
    const publicKey = `pk_${env.toLowerCase()}_${randomStr(24)}`;
    const secretKey = `sk_${env.toLowerCase()}_${randomStr(32)}`;

    const newKey: Omit<ApiKey, 'id'> = {
      name,
      publicKey,
      secretKey,
      environment: env,
      status: 'ACTIVE',
      scopes,
      createdAt: new Date().toISOString(),
    };

    await addDoc(keysRef, newKey);
    
    await AuditService.logAction(db, merchantId, {
      action: `Generated API Key: ${name}`,
      actor: 'system',
      category: 'API_KEY',
      environment: env,
      metadata: { scopes }
    });
  }

  static async revokeKey(
    db: Firestore,
    merchantId: string,
    keyId: string,
    env: Environment
  ): Promise<void> {
    const keyRef = doc(db, 'merchants', merchantId, 'apiKeys', keyId);
    await setDoc(keyRef, { status: 'REVOKED' }, { merge: true });
    
    await AuditService.logAction(db, merchantId, {
      action: `Revoked API Key`,
      actor: 'system',
      category: 'API_KEY',
      environment: env
    });
  }
}
