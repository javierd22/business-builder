import type { Metadata } from "next";
import Link from "next/link";
import BuildInfo from "./_components/BuildInfo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Builder",
  description: "Turn your ideas into structured plans and previews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors">
              Business Builder
            </Link>
            <nav>
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Business Builder. Turn ideas into reality.
            </p>
          </div>
        </footer>
        
        <BuildInfo />
      </body>
    </html>
  );
}
