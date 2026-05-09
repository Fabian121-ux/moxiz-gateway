
import { Firestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ApiKey } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export class ApiKeyService {
  static async generateKey(
    db: Firestore,
    merchantId: string,
    name: string,
    env: 'TEST' | 'LIVE' = 'TEST'
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
      createdAt: new Date().toISOString(),
    };

    addDoc(keysRef, newKey)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: keysRef.path,
          operation: 'create',
          requestResourceData: newKey
        }));
      });
  }

  static async revokeKey(
    db: Firestore,
    merchantId: string,
    keyId: string
  ): Promise<void> {
    const keyRef = doc(db, 'merchants', merchantId, 'apiKeys', keyId);
    setDoc(keyRef, { status: 'REVOKED' }, { merge: true })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: keyRef.path,
          operation: 'update',
          requestResourceData: { status: 'REVOKED' }
        }));
      });
  }
}
