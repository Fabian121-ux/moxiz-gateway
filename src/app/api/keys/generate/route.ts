import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { generateApiKey } from '@/services/api-keys';

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

    const { environment, name } = await req.json();

    if (!environment || !['sandbox', 'live'].includes(environment)) {
      return NextResponse.json({ error: 'Invalid environment' }, { status: 400 });
    }

    const newKey = await generateApiKey(merchantUser.merchant_id, environment, name);

    return NextResponse.json(newKey);

  } catch (err: any) {
    console.error('Key Generation Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
