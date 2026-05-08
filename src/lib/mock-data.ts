
import { Transaction, ApiKey, WebhookEvent } from './types';

export const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    reference: 'MOX-742-819',
    amount: 15000,
    currency: 'USD',
    status: 'SUCCESS',
    customerEmail: 'alex.dev@example.com',
    customerName: 'Alex Developer',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'tx_2',
    reference: 'MOX-112-902',
    amount: 4500,
    currency: 'USD',
    status: 'FAILED',
    customerEmail: 'sarah.smith@provider.io',
    customerName: 'Sarah Smith',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: 'tx_3',
    reference: 'MOX-883-221',
    amount: 1250,
    currency: 'USD',
    status: 'SUCCESS',
    customerEmail: 'mike@startup.com',
    customerName: 'Michael Chen',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86300000).toISOString(),
  },
  {
    id: 'tx_4',
    reference: 'MOX-551-004',
    amount: 89000,
    currency: 'USD',
    status: 'PENDING',
    customerEmail: 'finance@enterprise.co',
    customerName: 'Enterprise Finance',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'tx_5',
    reference: 'MOX-229-318',
    amount: 3200,
    currency: 'USD',
    status: 'SUCCESS',
    customerEmail: 'julie@design.net',
    customerName: 'Julie Watson',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172700000).toISOString(),
  }
];

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Main Website Integration',
    publicKey: 'pk_test_51MzS2Z...',
    secretKey: 'sk_test_51MzS2Z...',
    environment: 'TEST',
    createdAt: '2023-10-15T09:00:00Z',
  },
  {
    id: 'key_2',
    name: 'Mobile App API',
    publicKey: 'pk_live_88Vx9...',
    secretKey: 'sk_live_88Vx9...',
    environment: 'LIVE',
    createdAt: '2024-01-20T14:30:00Z',
  }
];

export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: 'wh_1',
    eventType: 'transaction.success',
    payload: { id: 'tx_1', status: 'SUCCESS' },
    status: 'SENT',
    retryCount: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'wh_2',
    eventType: 'transaction.failed',
    payload: { id: 'tx_2', status: 'FAILED' },
    status: 'FAILED',
    retryCount: 3,
    lastAttempt: new Date(Date.now() - 600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];
