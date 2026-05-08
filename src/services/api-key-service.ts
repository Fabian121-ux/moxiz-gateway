/**
 * @fileOverview API Key management logic.
 */

import { ApiKey } from '@/types';

export class ApiKeyService {
  static async getKeysForMerchant(merchantId: string): Promise<ApiKey[]> {
    return [
      {
        id: 'key_1',
        name: 'Default Test Key',
        publicKey: 'pk_test_51MzS2Z_moxiz_dev_99x',
        secretKey: 'sk_test_51MzS2Z_moxiz_secret_v001_88jk',
        environment: 'TEST',
        createdAt: new Date().toISOString(),
      }
    ];
  }

  static async rotateKey(keyId: string): Promise<void> {
    // Logic to generate new SK and update DB
    console.log(`Rotating key: ${keyId}`);
  }
}
