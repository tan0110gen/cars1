// components/CarCard.tsx
type Car = {
  id: number;
  title: string;
  price: number;
  location: string;
  created_at: string | null;
};

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/60">
      <div className="text-lg font-semibold">{car.title}</div>
      <div className="mt-1 opacity-80">${Number(car.price).toLocaleString()}</div>
      <div className="text-sm opacity-70">{car.location}</div>
    </div>
  );
}
