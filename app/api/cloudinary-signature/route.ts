import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  // UNIX seconds
  const timestamp = Math.floor(Date.now() / 1000);

  // Sign exactly the params you will send to Cloudinary upload (except file, api_key)
  const toSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({ timestamp, signature, apiKey });
}
