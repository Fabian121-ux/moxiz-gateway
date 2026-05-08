
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  eventType: 'transaction.success' | 'transaction.failed' | 'transaction.pending';
  payload: any;
  status: 'SENT' | 'FAILED' | 'PENDING';
  retryCount: number;
  lastAttempt?: string;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  publicKey: string;
  secretKey: string;
  environment: 'TEST' | 'LIVE';
  lastUsedAt?: string;
  createdAt: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}
