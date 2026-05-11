import { getAdminClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { analyzeTransactionRisk, flagTransaction } from './fraud';
import { dispatchWebhook } from './webhooks';

export type CreateTransactionParams = {
  merchantId: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  metadata?: any;
  environment: 'sandbox' | 'live';
};

/**
 * Creates a new simulated transaction.
 */
export async function createTransaction(params: CreateTransactionParams) {
  const supabase = getAdminClient();
  const reference = `tx_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
  
  // 1. Run Fraud Analysis
  const risk = await analyzeTransactionRisk(
    params.merchantId,
    params.amount,
    params.currency,
    params.customerEmail,
    params.metadata
  );

  let status: 'pending' | 'failed' = 'pending';
  
  // Block if risk is critical
  if (risk.score > 90) {
    status = 'failed';
  }

  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      merchant_id: params.merchantId,
      reference,
      amount: params.amount,
      currency: params.currency || 'USD',
      status,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      metadata: params.metadata || {},
      risk_score: risk.score,
      environment: params.environment
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Log fraud flags if risk is medium or higher
  if (risk.score >= 30) {
    for (const reason of risk.reasons) {
      await flagTransaction(transaction.id, params.merchantId, reason, risk.level);
    }
  }

  // 3. If status is pending, simulate a delayed success/failure
  if (status === 'pending') {
    simulatePaymentCompletion(transaction);
  } else {
    // Dispatch failure immediately
    await dispatchWebhook(params.merchantId, 'transaction.failed', transaction, params.environment);
  }

  return transaction;
}

/**
 * Simulates a payment completion after a delay.
 */
async function simulatePaymentCompletion(transaction: any) {
  // Wait for 2-5 seconds
  const delay = Math.floor(Math.random() * 3000) + 2000;
  
  setTimeout(async () => {
    const supabase = getAdminClient();
    
    // Most transactions succeed in sandbox
    const finalStatus = Math.random() > 0.1 ? 'success' : 'failed';
    const eventType = finalStatus === 'success' ? 'transaction.success' : 'transaction.failed';
    
    const { data: updatedTx, error } = await supabase
      .from('transactions')
      .update({ 
        status: finalStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)
      .select()
      .single();
      
    if (!error && updatedTx) {
      // Trigger Webhook
      await dispatchWebhook(transaction.merchant_id, eventType, updatedTx, transaction.environment);
    }
  }, delay);
}

