// app/api/cloudinary-signature/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

// IMPORTANT: value must match your Cloudinary unsigned/signed preset name
const UPLOAD_PRESET = "cars_upload";

export async function POST() {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      uploadPreset: UPLOAD_PRESET,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (e) {
    return NextResponse.json({ error: "Signature error" }, { status: 500 });
  }
}
