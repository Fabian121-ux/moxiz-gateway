import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { registerWebhook } from '@/services/webhooks';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get merchant ID for this user
    const { data: merchantUser, error: merchantError } = await supabase
      .from('merchant_users')
      .select('merchant_id')
      .eq('user_id', user.id)
      .single();

    if (merchantError || !merchantUser) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const { url, events, environment } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    const webhook = await registerWebhook(
      merchantUser.merchant_id,
      url,
      events || ['transaction.success', 'transaction.failed'],
      environment || 'sandbox'
    );

    return NextResponse.json(webhook);

  } catch (err: any) {
    console.error('Webhook Registration Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
