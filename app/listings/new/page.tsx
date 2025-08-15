'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
const MAKES:Record<string,string[]>={Toyota:['Camry','Corolla','Prius','RAV4'],Honda:['Civic','Accord','CR-V'],Tesla:['Model 3','Model Y','Model S'],BMW:['3 Series','5 Series','X5']}
export default function NewListing(){
  const [user,setUser]=useState<any>(null)
  const [make,setMake]=useState('Toyota'); const [model,setModel]=useState('Camry')
  const [year,setYear]=useState(2018); const [city,setCity]=useState('Los Angeles, CA')
  const [price,setPrice]=useState(12000); const [mileage,setMileage]=useState(80000)
  const [desc,setDesc]=useState(''); const [email,setEmail]=useState('')
  const [files,setFiles]=useState<FileList|null>(null); const [saving,setSaving]=useState(false)
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user||null))},[])
  async function uploadImage(f:File){
    const fd=new FormData(); fd.append('file', f)
    fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET||'')
    const cloud=process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const r=await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`,{method:'POST',body:fd})
    if(!r.ok) throw new Error('upload failed'); const j=await r.json(); return j.secure_url as string
  }
  async function submit(){
    if(!user){ alert('Please sign in first (Account page).'); return }
    setSaving(true)
    try{
      const photos:string[]=[]
      if(files){ for(const f of Array.from(files)){ photos.push(await uploadImage(f)) } }
      const { error } = await supabase.from('listings').insert({ seller_id:user.id, make, model, year, city, price, mileage, description:desc, contact_email: email, photos })
      if(error) throw error
      alert('Listing published!'); window.location.href='/listings'
    }catch(e:any){ alert(e.message) } finally{ setSaving(false) }
  }
  return (<main className='max-w-xl mx-auto p-6 space-y-3'>
    <h1 className='text-2xl font-bold mb-2'>Post a car</h1>
    <label className='block'>Make
      <select className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={make} onChange={e=>{setMake(e.target.value);setModel(MAKES[e.target.value][0])}}>
        {Object.keys(MAKES).map(m=>(<option key={m}>{m}</option>))}
      </select>
    </label>
    <label className='block'>Model
      <select className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={model} onChange={e=>setModel(e.target.value)}>
        {MAKES[make].map(m=>(<option key={m}>{m}</option>))}
      </select>
    </label>
    <div className='grid grid-cols-2 gap-3'>
      <label>Year<input type='number' className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={year} onChange={e=>setYear(+e.target.value)}/></label>
      <label>City<input className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={city} onChange={e=>setCity(e.target.value)}/></label>
      <label>Price ($)<input type='number' className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={price} onChange={e=>setPrice(+e.target.value)}/></label>
      <label>Mileage (mi)<input type='number' className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={mileage} onChange={e=>setMileage(+e.target.value)}/></label>
    </div>
    <label>Description<textarea className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={desc} onChange={e=>setDesc(e.target.value)} /></label>
    <label>Contact Email<input className='w-full mt-1 bg-white/10 border border-white/10 p-2 rounded' value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <label>Photos (up to 6)<input type='file' multiple accept='image/*' className='block mt-1' onChange={e=>setFiles(e.target.files)} /></label>
    <button disabled={saving} onClick={submit} className='px-4 py-2 rounded bg-white text-black'>{saving? 'Publishing...' : 'Publish'}</button>
  </main>)
}
