/**
 * @fileOverview Business logic for Transaction processing.
 */

import { Transaction } from '@/types';
import { mockTransactions } from '@/lib/mock-data';

export class TransactionService {
  static async getRecentTransactions(merchantId: string, limit = 10): Promise<Transaction[]> {
    // Placeholder for Prisma query
    return mockTransactions.slice(0, limit);
  }

  static async createTransaction(merchantId: string, data: Partial<Transaction>): Promise<Transaction> {
    // Placeholder logic
    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substring(7)}`,
      reference: `MOX-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`,
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      status: 'PENDING',
      customerEmail: data.customerEmail || '',
      customerName: data.customerName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newTx;
  }
}
