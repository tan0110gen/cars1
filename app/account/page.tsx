'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] =
    useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // initial user
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription?.unsubscribe();
  }, []);

  async function sendMagicLink() {
    if (!email) return;
    setStatus('sending');
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // after clicking the email link, return here on the same domain
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('sent');
      setMessage('Check your inbox for the magic link.');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Account</h1>

      {user ? (
        <div className="space-y-4">
          <p className="text-sm text-white/80">
            Signed in as <span className="font-semibold">{user.email}</span>
          </p>
          <button
            onClick={signOut}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3"
          />
          <button
            onClick={sendMagicLink}
            disabled={status === 'sending' || !email}
            className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-black disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send magic link'}
          </button>
          {!!message && (
            <p
              className={`text-sm ${
                status === 'error' ? 'text-red-400' : 'text-white/70'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
