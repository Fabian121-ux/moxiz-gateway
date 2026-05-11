import { getAdminClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Basic Fraud/Risk Check Simulation
  const riskScore = Math.floor(Math.random() * 100);
  let status: 'pending' | 'failed' = 'pending';
  
  if (riskScore > 90) {
    status = 'failed';
  }

  const { data, error } = await supabase
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
      risk_score: riskScore,
      environment: params.environment
    })
    .select()
    .single();

  if (error) throw error;

  // If status is pending, simulate a delayed success/failure
  if (status === 'pending') {
    simulatePaymentCompletion(data.id);
  }

  return data;
}

/**
 * Simulates a payment completion after a delay.
 */
async function simulatePaymentCompletion(transactionId: string) {
  // Wait for 2-5 seconds
  const delay = Math.floor(Math.random() * 3000) + 2000;
  
  setTimeout(async () => {
    const supabase = getAdminClient();
    const finalStatus = Math.random() > 0.1 ? 'success' : 'failed';
    
    await supabase
      .from('transactions')
      .update({ 
        status: finalStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);
      
    // Trigger Webhook (Future implementation)
    // await triggerWebhook('transaction.updated', transactionId);
  }, delay);
}

/**
 * Retrieves a transaction by reference.
 */
export async function getTransactionByReference(reference: string, merchantId: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('reference', reference)
    .eq('merchant_id', merchantId)
    .single();

  if (error) return null;
  return data;
}
