import { getAdminClient } from '@/lib/supabase-server';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAnalysis {
  score: number;
  level: RiskLevel;
  reasons: string[];
}

/**
 * Analyzes a transaction for potential fraud.
 */
export async function analyzeTransactionRisk(
  merchantId: string,
  amount: number,
  currency: string,
  customerEmail?: string,
  metadata: any = {}
): Promise<RiskAnalysis> {
  const supabase = getAdminClient();
  const reasons: string[] = [];
  let score = 0;

  // 1. Check for Duplicate Transactions (within last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: duplicates } = await supabase
    .from('transactions')
    .select('id')
    .eq('merchant_id', merchantId)
    .eq('amount', amount)
    .eq('currency', currency)
    .eq('customer_email', customerEmail || '')
    .gt('created_at', fiveMinutesAgo);

  if (duplicates && duplicates.length > 0) {
    score += 40;
    reasons.push('Possible duplicate transaction detected');
  }

  // 2. Amount Thresholds
  if (amount > 1000000) { // $10,000
    score += 20;
    reasons.push('High transaction amount');
  }

  // 3. Email Check
  if (customerEmail && (customerEmail.includes('test') || customerEmail.includes('fake'))) {
    score += 15;
    reasons.push('Suspicious customer email');
  }

  // 4. Random noise for simulation
  score += Math.floor(Math.random() * 10);

  // Determine level
  let level: RiskLevel = 'low';
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'high';
  else if (score >= 30) level = 'medium';

  return { score, level, reasons };
}

/**
 * Logs a fraud flag for a transaction.
 */
export async function flagTransaction(
  transactionId: string,
  merchantId: string,
  reason: string,
  severity: RiskLevel
) {
  const supabase = getAdminClient();
  await supabase.from('fraud_flags').insert({
    transaction_id: transactionId,
    merchant_id: merchantId,
    reason,
    severity
  });
}
