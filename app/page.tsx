import Link from 'next/link'
export default function Page(){return(
  <main className='max-w-5xl mx-auto px-4 py-12'>
    <h1 className='text-4xl font-bold mb-3'>Sell your car. Directly.</h1>
    <p className='text-white/70 mb-8'>No dealers. Post in minutes, chat safely, close the deal on your terms.</p>
    <div className='flex gap-3'>
      <Link href='/listings' className='px-4 py-2 rounded bg-white text-black'>Browse listings</Link>
      <Link href='/listings/new' className='px-4 py-2 rounded border border-white/20'>Post a car</Link>
    </div>
  </main>)
}
