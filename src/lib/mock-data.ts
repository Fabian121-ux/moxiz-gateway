/**
 * @fileOverview Realistic test data for local development.
 */

import { Transaction, WebhookEvent, ApiKey } from '@/types';

export const mockTransactions: Transaction[] = [
  {
    id: 'tx_7721',
    reference: 'MOX-882-101',
    amount: 25000,
    currency: 'USD',
    status: 'SUCCESS',
    customerEmail: 'dev.lead@startup.io',
    customerName: 'Marcus Engineer',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'tx_7722',
    reference: 'MOX-112-902',
    amount: 1250,
    currency: 'USD',
    status: 'FAILED',
    customerEmail: 'alex@cloud-services.net',
    customerName: 'Alex Riviera',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
  },
  {
    id: 'tx_7723',
    reference: 'MOX-901-442',
    amount: 89000,
    currency: 'USD',
    status: 'SUCCESS',
    customerEmail: 'billing@enterprise.com',
    customerName: 'Enterprise Billing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'tx_7724',
    reference: 'MOX-551-004',
    amount: 3200,
    currency: 'USD',
    status: 'PENDING',
    customerEmail: 'jane.smith@design.co',
    customerName: 'Jane Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: 'wh_ev_99x',
    eventType: 'payment.succeeded',
    payload: { transactionId: 'tx_7721' },
    status: 'SENT',
    retryCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
  },
  {
    id: 'wh_ev_88y',
    eventType: 'payment.failed',
    payload: { transactionId: 'tx_7722', error: 'insufficient_funds' },
    status: 'FAILED',
    retryCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 114).toISOString(),
  }
];
