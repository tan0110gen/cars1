import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
export default async function Listings(){
  const { data: listings } = await supabase.from('listings').select('*').order('created_at',{ascending:false})
  return (<main className='max-w-5xl mx-auto p-6'>
    <h1 className='text-2xl font-bold mb-4'>Marketplace</h1>
    <div className='grid md:grid-cols-2 gap-4'>
      {(listings||[]).map((x:any)=>(
        <Link key={x.id} href={'/listings/'+x.id} className='border border-white/10 rounded p-4 hover:bg-white/5'>
          <div className='font-semibold'>{x.make} {x.model} · {x.year}</div>
          <div className='text-white/70'>${'{'}x.price{'}'} · {x.mileage} mi · {x.city}</div>
        </Link>
      ))}
    </div>
  </main>)
}
