
'use client';

import { useState, useEffect } from 'react';

export type MockUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export function useUser() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage for persistence in demo mode
    const storedUser = localStorage.getItem('moxiz_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('moxiz_session');
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
