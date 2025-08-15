'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute redirect URL: use current origin on the client, otherwise fallback to Vercel domain
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/account`
      : 'https://cars-myi6.vercel.app/account'; // <-- ваш публичный домен на Vercel

  useEffect(() => {
    // initial user fetch
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    if (!email.trim()) {
      setMsg('Enter your email first.');
      return;
    }
    setLoading(true);
    setMsg('Sending magic link...');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    setMsg(error ? error.message : 'Check your email for the magic link.');
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account</h1>

      {user ? (
        <div className="space-y-4">
          <p className="text-white/80">
            Signed in as <b>{user.email}</b>
          </p>
          <button
            onClick={signOut}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
          >
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10"
          />
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
          {!!msg && <p className="text-sm text-white/70">{msg}</p>}
        </div>
      )}
    </main>
  );
}
