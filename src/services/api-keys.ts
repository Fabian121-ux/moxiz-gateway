import { getAdminClient } from '@/lib/supabase';
import crypto from 'node:crypto';

/**
 * Generates a new API key for a merchant.
 * Format: sk_[test|live]_[random_string]
 */
export async function generateApiKey(
  merchantId: string,
  environment: 'sandbox' | 'live',
  name: string = 'Default Key'
) {
  const supabase = getAdminClient();
  const prefix = environment === 'sandbox' ? 'sk_test' : 'sk_live';
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const apiKey = `${prefix}_${randomBytes}`;
  
  // Hash the key for storage
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  const keyHint = `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      merchant_id: merchantId,
      name,
      environment,
      hashed_key: hashedKey,
      key_hint: keyHint,
      scopes: ['all']
    })
    .select()
    .single();

  if (error) throw error;

  // Return the raw key only once
  return {
    ...data,
    rawKey: apiKey
  };
}

/**
 * Verifies an API key and returns the associated merchant.
 */
export async function verifyApiKey(apiKey: string) {
  const supabase = getAdminClient();
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

  const { data, error } = await supabase
    .from('api_keys')
    .select('*, merchants(*)')
    .eq('hashed_key', hashedKey)
    .single();

  if (error || !data) return null;

  // Update last used at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return data;
}

/**
 * List API keys for a merchant.
 */
export async function listApiKeys(merchantId: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Revoke an API key.
 */
export async function revokeApiKey(keyId: string) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId);

  if (error) throw error;
  return true;
}
