import { createClient } from '@/lib/supabase';

/**
 * Logs an action to the audit_logs table.
 */
export async function logAuditAction(
  merchantId: string,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null = null,
  metadata: any = {}
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      merchant_id: merchantId,
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      ip_address: '127.0.0.1', // In a real app, get this from request headers
    });

  if (error) {
    console.error('Failed to log audit action:', error);
  }
}
