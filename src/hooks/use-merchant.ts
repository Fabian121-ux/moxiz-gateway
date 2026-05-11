import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react'; // Wait, I need to check if they have this

// Let's use a simple version first
export function useMerchant() {
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMerchant() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('merchant_users')
        .select('*, merchants(*)')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setMerchant(data.merchants);
      }
      setLoading(false);
    }

    fetchMerchant();
  }, []);

  return { merchant, loading };
}
