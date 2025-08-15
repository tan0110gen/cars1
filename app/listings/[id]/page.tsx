import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Car = {
  id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
};

export default async function CarDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-red-400">Invalid ID.</p>
        <Link href="/listings" className="underline">Back to listings</Link>
      </main>
    );
  }

  const { data, error } = await supabase
    .from<Car>("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-red-400">Car not found.</p>
        <Link href="/listings" className="underline">Back to listings</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/listings" className="underline text-sm opacity-70">← Back</Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 border border-white/10">
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full grid place-items-center opacity-60">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-emerald-300 text-2xl font-semibold">${data.price.toLocaleString()}</p>

          <ul className="text-sm opacity-80 space-y-1">
            <li>Year: <b>{data.year}</b></li>
            <li>Mileage: <b>{data.mileage.toLocaleString()}</b> km</li>
            <li>Location: <b>{data.location}</b></li>
          </ul>

          {data.description && (
            <p className="opacity-90 leading-relaxed">{data.description}</p>
          )}
        </div>
      </div>
    </main>
  );
}
