'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormState = {
  title: string;
  price: string;
  year: string;
  mileage: string;
  location: string;
  image_url: string;
  description: string;
};

async function uploadImage(file: File) {
  // 1) get signature from our server
  const signRes = await fetch('/api/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!signRes.ok) throw new Error('Sign request failed');
  const { timestamp, signature, apiKey, cloudName } = await signRes.json();

  // 2) upload to Cloudinary
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', apiKey);
  fd.append('timestamp', String(timestamp));
  fd.append('upload_preset', 'cars_upload'); // must exist in Cloudinary
  fd.append('signature', signature);

  const cloud = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  const data = await cloud.json();
  if (!cloud.ok) {
    throw new Error(data?.error?.message || 'Cloud upload failed');
  }
  return data.secure_url as string;
}

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    year: '',
    mileage: '',
    location: '',
    image_url: '',
    description: '',
  });

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImage(file);
      setForm((s) => ({ ...s, image_url: url }));
      alert('Image uploaded');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          price: Number(form.price),
          year: Number(form.year),
          mileage: Number(form.mileage),
          location: form.location.trim(),
          image_url: form.image_url || null,
          description: form.description.trim() || null,
        }),
      });
      if (!res.ok) {
        const m = await res.json().catch(() => ({}));
        throw new Error(m?.error || 'Failed to create listing');
      }
      router.push('/listings');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Create listing</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
          value={form.title}
          onChange={onChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            min={0}
            placeholder="Price, USD"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            value={form.price}
            onChange={onChange}
            required
          />
          <input
            name="year"
            type="number"
            min={1980}
            placeholder="Year"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            value={form.year}
            onChange={onChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="mileage"
            type="number"
            min={0}
            placeholder="Mileage, km"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            value={form.mileage}
            onChange={onChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            value={form.location}
            onChange={onChange}
            required
          />
        </div>

        {/* image uploader */}
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
          />
          <input
            name="image_url"
            placeholder="Image URL will appear here after upload"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            value={form.image_url}
            onChange={onChange}
            readOnly
          />
        </div>

        <textarea
          name="description"
          rows={4}
          placeholder="Description (optional)"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
          value={form.description}
          onChange={onChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-xl bg-white text-black font-semibold px-5 py-3 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Publish'}
        </button>
      </form>
    </main>
  );
}
