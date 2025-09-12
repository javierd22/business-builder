// DO NOT add "use client" here.
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Builder MVP",
  description: "Turn ideas into products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/" className="font-semibold">🚀 Business Builder MVP</a>
            <a href="/dashboard" className="underline">Dashboard</a>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
