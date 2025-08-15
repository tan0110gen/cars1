// app/api/cars/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // simple validation / normalization
    const title = String(body.title ?? "").trim();
    const location = String(body.location ?? "").trim();
    const price = Number(body.price);
    const year = Number(body.year);
    const mileage = Number(body.mileage);
    const image_url = body.image_url ? String(body.image_url).trim() : null;
    const description = body.description ? String(body.description).trim() : null;

    if (!title || !location || Number.isNaN(price) || Number.isNaN(year) || Number.isNaN(mileage)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    // optional business rules
    if (year < 1980 || year > new Date().getFullYear() + 1) {
      return NextResponse.json({ success: false, error: "Invalid year" }, { status: 400 });
    }
    if (price < 0 || mileage < 0) {
      return NextResponse.json({ success: false, error: "Invalid numbers" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cars")
      .insert([{ title, price, year, mileage, location, image_url, description }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, car: data[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message ?? "Server error" }, { status: 500 });
  }
}
