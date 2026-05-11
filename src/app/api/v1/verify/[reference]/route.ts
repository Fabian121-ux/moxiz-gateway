import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/services/api-keys';
import { getTransactionByReference } from '@/services/transactions';

export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = await params;

    // 1. Authenticate with API Key
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
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

    // 2. Fetch Transaction
    const transaction = await getTransactionByReference(reference, keyData.merchant_id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
