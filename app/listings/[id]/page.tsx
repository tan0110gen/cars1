'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
type Msg={id:string,created_at:string,content:string,sender_id:string,listing_id:string}
export default function Listing(){
  const id = typeof window!=='undefined'? window.location.pathname.split('/').pop() : ''
  const [item,setItem]=useState<any>(null)
  const [msgs,setMsgs]=useState<Msg[]>([])
  const [input,setInput]=useState('')
  const [user,setUser]=useState<any>(null)
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('listings').select('*').eq('id', id).single(); setItem(data)
    const { data: m } = await supabase.from('messages').select('*').eq('listing_id', id).order('created_at',{ascending:true}); setMsgs(m||[])
    supabase.auth.getUser().then(({data})=>setUser(data.user||null))
    const channel = supabase.channel('realtime:messages')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`listing_id=eq.${id}`}, (payload)=>{ setMsgs((cur)=>[...cur, payload.new as any]) })
      .subscribe()
    return ()=>{supabase.removeChannel(channel)}
  })() },[id])
  async function send(){
    if(!user){ alert('Sign in on the Account page first.'); return }
    if(!input.trim()) return
    await supabase.from('messages').insert({ listing_id:id, content:input, sender_id:user.id })
    setInput('')
  }
  if(!item) return <main className='max-w-5xl mx-auto p-6'>Loading...</main>
  return (<main className='max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6'>
    <div className='md:col-span-2 space-y-2'>
      <h1 className='text-2xl font-bold'>{item.make} {item.model} · {item.year}</h1>
      <div className='text-white/70'>{item.city} · ${'{'}item.price{'}'} · {item.mileage} mi</div>
      <p className='mt-3 whitespace-pre-wrap'>{item.description}</p>
      {Array.isArray(item.photos)&& item.photos.length>0 && (
        <div className='grid grid-cols-2 gap-2 mt-3'>
          {item.photos.map((u:string)=>(<img key={u} src={u} alt='' className='w-full rounded'/>))}
        </div>) }
    </div>
    <aside className='border border-white/10 rounded p-3'>
      <h2 className='font-semibold mb-2'>Chat with seller</h2>
      <div className='h-64 overflow-auto bg-white/5 rounded p-2 space-y-1'>
        {msgs.map(m=>(<div key={m.id} className='text-sm'><b>{m.sender_id===(user?.id||'')? 'You':'User'}</b>: {m.content}</div>))}
      </div>
      <div className='flex gap-2 mt-2'>
        <input value={input} onChange={e=>setInput(e.target.value)} className='flex-1 bg-white/10 border border-white/10 rounded px-2' placeholder='Type message...'/>
        <button onClick={send} className='px-3 py-2 rounded bg-white text-black'>Send</button>
      </div>
      {item.contact_email && <a href={'mailto:'+item.contact_email} className='block text-white/80 text-sm mt-3 underline'>Email seller</a>}
    </aside>
  </main>)
}
