"use client";
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!loggedIn) {
    return (
      <button onClick={() => router.push('/login')} className="border p-2 rounded text-sm">
        Log In
      </button>
    );
  }

  return (
    <button onClick={handleLogout} className="border p-2 rounded text-sm">
      Log Out
    </button>
  );
}
