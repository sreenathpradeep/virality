"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/');
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form className="flex flex-col gap-4 w-80" onSubmit={signIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Sign In
        </button>
        <button onClick={signUp} className="border p-2 rounded" type="button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
