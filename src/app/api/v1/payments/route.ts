import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/services/api-keys';
import { createTransaction } from '@/services/transactions';
import { dispatchWebhook } from '@/services/webhooks';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with API Key
    const authHeader = req.headers.get('Authorization');
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
      merchantId: keyData.merchant_id,
      amount,
      currency: currency || 'USD',
      customerEmail: customer_email,
      customerName: customer_name,
      metadata,
      environment: keyData.environment
    });

    // 4. Dispatch initial event
    await dispatchWebhook(
      keyData.merchant_id,
      'payment.created',
      transaction,
      keyData.environment
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
