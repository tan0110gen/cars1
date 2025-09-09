// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "EasyCar",
  description: "Sell your car. Directly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className="text-white">
        <header className="border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-6">
            <Link href="/" className="font-bold">EasyCar</Link>
            <Link href="/marketplace" className="text-white/80 hover:text-white">Marketplace</Link>
            <Link href="/post" className="text-white/80 hover:text-white">Post a car</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
