/**
 * @fileOverview Centralized type definitions for the Moxiz platform.
 */

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
export type Environment = 'TEST' | 'LIVE';
export type MerchantStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Merchant {
  id: string;
  businessName: string;
  email: string;
  status: MerchantStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  amount: number; // in cents
  currency: string;
  status: TransactionStatus;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  publicKey: string;
  secretKey: string;
  environment: Environment;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  eventType: string;
  payload: any;
  status: 'SENT' | 'FAILED' | 'PENDING';
  retryCount: number;
  lastAttempt?: string;
  createdAt: string;
}
