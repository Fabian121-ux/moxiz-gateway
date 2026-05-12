import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/services/api-keys';
import { createTransaction } from '@/services/transactions';
import { dispatchWebhook } from '@/services/webhooks';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with API Key or Internal Simulation
    const authHeader = req.headers.get('Authorization');
    const isInternal = req.headers.get('X-Internal-Simulation') === 'true';
    
    let merchantId: string;
    let environment: 'sandbox' | 'live' = 'sandbox';

    if (isInternal) {
      // For internal simulation, we need the merchant from the session
      const { createServerSupabaseClient } = await import('@/lib/supabase');
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
      }

      const { data: merchantUser } = await supabase
        .from('merchant_users')
        .select('merchant_id')
        .eq('user_id', user.id)
        .single();

      if (!merchantUser) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }

      merchantId = merchantUser.merchant_id;
      environment = 'sandbox';
    } else {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid Authorization header. Expected "Bearer sk_..."' },
          { status: 401 }
        );
      }

      const apiKey = authHeader.split(' ')[1];
      const keyData = await verifyApiKey(apiKey);

      if (!keyData) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      merchantId = keyData.merchant_id;
      environment = keyData.environment;
    }


    // 2. Parse and Validate Request
    const body = await req.json();
    const { amount, currency, customer_email, customer_name, metadata } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Amount is required and must be a number (in cents)' },
        { status: 400 }
      );
    }

    // 3. Create Transaction
    const transaction = await createTransaction({
      merchantId: merchantId,
      amount,
      currency: currency || 'USD',
      customerEmail: customer_email,
      customerName: customer_name,
      metadata,
      environment: environment
    });

    // 4. Dispatch initial event
    await dispatchWebhook(
      merchantId,
      'payment.created',
      transaction,
      environment
    );

    return NextResponse.json(transaction, { status: 201 });


  } catch (err: any) {
    console.error('Payment API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
