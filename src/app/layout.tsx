import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Builder MVP",
  description: "Idea → PRD → UX → Preview",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="mx-auto max-w-5xl p-4 flex items-center gap-4">
            <Link href="/" className="font-semibold">Business Builder</Link>
            <Link href="/dashboard" className="underline">Dashboard</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
