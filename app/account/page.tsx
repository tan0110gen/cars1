'use client'
import { useState,useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
export default function Account(){
  const [email,setEmail]=useState('')
  const [user,setUser]=useState<any>(null)
  const [msg,setMsg]=useState('')
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user||null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,session)=>{setUser(session?.user||null)})
    return ()=>{sub.subscription.unsubscribe()}
  },[])
  async function signIn(){
    setMsg('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: window.location.origin+'/account' }})
    setMsg(error? error.message : 'Check your email for the magic link.')
  }
  async function signOut(){ await supabase.auth.signOut() }
  return (<main className='max-w-md mx-auto p-6'>
    <h1 className='text-2xl font-bold mb-4'>Account</h1>
    {user? (
      <div>
        <p className='mb-4'>Signed in as <b>{user.email}</b></p>
        <button onClick={signOut} className='px-3 py-2 rounded bg-white text-black'>Sign out</button>
      </div>
    ):(
      <div className='space-y-3'>
        <input className='w-full px-3 py-2 rounded bg-white/10 border border-white/10' placeholder='you@example.com' value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={signIn} className='px-3 py-2 rounded bg-white text-black w-full'>Send magic link</button>
        {!!msg && <p className='text-white/70 text-sm'>{msg}</p>}
      </div>
    )}
  </main>)
}
