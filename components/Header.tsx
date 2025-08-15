import Link from 'next/link'
export default function Header(){
  return (
    <header className='border-b border-white/10 sticky top-0 backdrop-blur bg-black/50 z-10'>
      <div className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-4'>
        <Link href='/' className='font-bold text-white'>EasyCar</Link>
        <nav className='text-sm text-white/80 flex items-center gap-4'>
          <Link href='/listings'>Marketplace</Link>
          <Link href='/listings/new' className='px-2 py-1 rounded bg-white/10 hover:bg-white/20'>Post a car</Link>
          <Link href='/account' className='ml-auto'>Account</Link>
        </nav>
      </div>
    </header>
  )
}
