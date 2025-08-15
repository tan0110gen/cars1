import Image from "next/image";

export type Car = {
  id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  image_url: string | null;
  description: string | null;
};

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
      <div className="relative aspect-[16/10]">
        <Image
          src={
            car.image_url ||
            "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop"
          }
          alt={car.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 400px"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{car.title}</h3>
          <span className="text-emerald-300 font-semibold">
            ${car.price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-white/70">
          {car.year} • {car.mileage.toLocaleString()} km • {car.location}
        </p>
        {car.description ? (
          <p className="text-sm text-white/60 line-clamp-2">{car.description}</p>
        ) : null}
      </div>
    </div>
  );
}
