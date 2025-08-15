import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import CarCard, { Car } from "../components/CarCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: false })
    .limit(8);

  return (
    <main>
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1511919884226-fb3c904869e2?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Sell your car. Directly.
            </h1>
            <p className="mt-4 text-lg text-white/80">
              No dealers. 15–30 minutes, a few clicks, close the deal on your terms.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/listings/new" className="inline-flex items-center rounded-xl bg-white text-black font-semibold px-5 py-3 hover:opacity-90">
                Create listing
              </Link>
              <Link href="/listings" className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
                Browse cars
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest listings</h2>
          <Link href="/listings" className="text-sm text-white/70 hover:text-white">View all →</Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(cars as Car[] | null)?.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
        {!cars || cars.length === 0 ? (
          <p className="text-white/70 mt-6">No listings yet. Click “Create listing”.</p>
        ) : null}
      </section>
    </main>
  );
}
