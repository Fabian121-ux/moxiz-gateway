import { getAdminClient } from '@/lib/supabase';
import crypto from 'node:crypto';

export type WebhookPayload = {
  id: string;
  type: string;
  created: number;
  data: any;
};

/**
 * Registers a new webhook endpoint for a merchant.
 */
export async function registerWebhook(
  merchantId: string,
  url: string,
  events: string[] = ['transaction.success', 'transaction.failed'],
  environment: 'sandbox' | 'live' = 'sandbox'
) {
  const supabase = getAdminClient();
  const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

  const { data, error } = await supabase
    .from('webhooks')
    .insert({
      merchant_id: merchantId,
      url,
      secret,
      events,
      environment
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generates a webhook signature for verification.
 * Format: t=TIMESTAMP,v1=SIGNATURE
 */
export function generateWebhookSignature(payload: string, secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

/**
 * Dispatches a webhook event to all registered endpoints.
 */
export async function dispatchWebhook(
  merchantId: string,
  eventType: string,
  eventData: any,
  environment: 'sandbox' | 'live' = 'sandbox'
) {
  const supabase = getAdminClient();

  // Find active webhooks for this merchant and event
  const { data: webhooks, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('status', 'active')
    .eq('environment', environment)
    .contains('events', [eventType]);

  if (error || !webhooks) return;

  const payload: WebhookPayload = {
    id: `evt_${crypto.randomBytes(12).toString('hex')}`,
    type: eventType,
    created: Math.floor(Date.now() / 1000),
    data: eventData
  };

  const payloadString = JSON.stringify(payload);

  for (const webhook of webhooks) {
    const signature = generateWebhookSignature(payloadString, webhook.secret);

    // Log the event as pending
    const { data: eventRecord, error: logError } = await supabase
      .from('webhook_events')
      .insert({
        webhook_id: webhook.id,
        event_type: eventType,
        payload: payload,
        status: 'pending'
      })
      .select()
      .single();

    if (logError) continue;

    // Trigger delivery (Fire and forget for now, in production use a queue)
    deliverWebhook(webhook.url, payloadString, signature, eventRecord.id);
  }
}

/**
 * Actually performs the HTTP request to the merchant's server.
 */
async function deliverWebhook(
  url: string,
  payload: string,
  signature: string,
  eventId: string
) {
  const supabase = getAdminClient();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Moxiz-Signature': signature,
        'User-Agent': 'Moxiz-Webhook/1.0'
      },
      body: payload,
      // Short timeout for webhooks
      signal: AbortSignal.timeout(5000)
    });

    const status = response.ok ? 'delivered' : 'failed';
    const responseBody = await response.text();

    await supabase
      .from('webhook_events')
      .update({
        status,
        response_code: response.status,
        response_body: responseBody.substring(0, 1000), // Limit storage
        last_attempt_at: new Date().toISOString()
      })
      .eq('id', eventId);

  } catch (err: any) {
    await supabase
      .from('webhook_events')
      .update({
        status: 'failed',
        response_body: err.message,
        last_attempt_at: new Date().toISOString()
      })
      .eq('id', eventId);
  }
}
