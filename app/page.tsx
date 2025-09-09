// app/page.tsx
import Link from "next/link";
import CarCard from "@/components/CarCard";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = getSupabaseClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: false })
    .limit(6);

  return (
    <main className="relative">
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Sell your car. Directly.
        </div>
        <p className="mt-4 text-white/80 max-w-xl">
          No dealers. Post in minutes, chat safely, close the deal on your terms.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/marketplace" className="inline-flex items-center rounded-xl bg-white text-black font-semibold px-5 py-3 hover:opacity-90">
            Browse listings
          </Link>
          <Link href="/post" className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
            Post a car
          </Link>
        </div>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Latest listings</h2>
            <Link href="/marketplace" className="text-sm text-white/80 hover:text-white">View all →</Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {(cars ?? []).map((c) => <CarCard key={c.id} car={c as any} />)}
          </div>

          {(!cars || cars.length === 0) && (
            <p className="text-white/70 mt-6">No listings yet. Click <Link href="/post" className="underline">“Post a car”</Link>.</p>
          )}
        </section>
      </section>
    </main>
  );
}
