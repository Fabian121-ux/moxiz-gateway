/**
 * @fileOverview Business logic for Merchant management.
 */

import { Merchant } from '@/types';

export class MerchantService {
  /**
   * Fetches merchant profile by ID.
   * Currently mocked, but prepared for Supabase/Prisma integration.
   */
  static async getMerchantById(id: string): Promise<Merchant | null> {
    // Placeholder for: await prisma.merchant.findUnique({ where: { id } })
    return {
      id,
      businessName: "Acme Infrastructure Ltd",
      email: "billing@acme.com",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }

  static async updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant> {
    // Placeholder logic
    return {
      id,
      businessName: data.businessName || "Acme Infrastructure Ltd",
      email: data.email || "billing@acme.com",
      status: data.status || "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }
}
