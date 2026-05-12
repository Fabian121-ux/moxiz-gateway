import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { dispatchWebhook } from '@/services/webhooks';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: merchantUser } = await supabase
      .from('merchant_users')
      .select('merchant_id')
      .eq('user_id', user.id)
      .single();

    if (!merchantUser) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const { url, eventType } = await req.json();

    const mockPayload = {
      id: 'test_' + Math.random().toString(36).substr(2, 9),
      type: eventType || 'transaction.success',
      data: {
        amount: 5000,
        currency: 'USD',
        status: 'success',
        reference: 'TEST_REF_123'
      },
      created_at: new Date().toISOString()
    };

    // If a URL is provided, we send it there directly.
    // Otherwise, we dispatch to all registered webhooks for this merchant.
    const result = await dispatchWebhook(
      merchantUser.merchant_id,
      eventType || 'transaction.success',
      mockPayload.data,
      'sandbox'
    );

    return NextResponse.json({ success: true, result });

  } catch (err: any) {
    console.error('Webhook Test Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
