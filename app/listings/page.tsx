import { createClient } from "@supabase/supabase-js";
import CarCard, { Car } from "../../components/CarCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">All listings</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(cars as Car[] | null)?.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      {!cars || cars.length === 0 ? (
        <p className="text-white/70 mt-6">No listings yet.</p>
      ) : null}
    </main>
  );
}
