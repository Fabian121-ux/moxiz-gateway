import { createClient } from '@/lib/supabase';

/**
 * Signs up a new merchant and creates their organization profile.
 */
export async function signUpMerchant(email: string, password: string, businessName: string) {
  const supabase = createClient();

  // 1. Sign up user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: businessName, // Using business name as initial full name for the user
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // 2. Create merchant record
  const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const uniqueSlug = `${slug}-${Math.random().toString(36).substring(7)}`;

  const { data: merchant, error: merchantError } = await supabase
    .from('merchants')
    .insert({
      name: businessName,
      slug: uniqueSlug,
    })
    .select()
    .single();

  if (merchantError) throw merchantError;

  // 3. Link user to merchant as owner
  const { error: linkError } = await supabase
    .from('merchant_users')
    .insert({
      merchant_id: merchant.id,
      user_id: authData.user.id,
      role: 'owner',
    });

  if (linkError) throw linkError;

  // 4. Generate initial Sandbox API Key automatically
  try {
    const { generateApiKey } = await import('./api-keys');
    await generateApiKey(merchant.id, 'sandbox', 'Default Sandbox Key');
  } catch (keyErr) {
    console.warn('Failed to generate initial API key:', keyErr);
    // Non-blocking
  }

  return { user: authData.user, merchant };
}


/**
 * Logs in a merchant.
 */
export async function loginMerchant(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sends a magic link to the user's email.
 */
export async function signInWithMagicLink(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return true;
}

/**
 * Logs out the current user.
 */
export async function logoutMerchant() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

