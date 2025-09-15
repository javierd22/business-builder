// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import IdeaBox from "./_components/IdeaBox";

export const revalidate = 0;            // keep fresh while we debug deploys
export const dynamic = "force-dynamic"; // avoid stale HTML

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c7c7f9] via-[#d7dbff] to-transparent [background-image:linear-gradient(180deg,transparent,rgba(255,179,123,0.55))]">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-amber-500 text-white">●</span>
            <span>Business Builder</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
            <Link href="#product" className="hover:text-gray-900">Product</Link>
            <Link href="#resources" className="hover:text-gray-900">Resources</Link>
            <Link href="#pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="#enterprise" className="hover:text-gray-900">Enterprise</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              aria-label="Change language"
              className="rounded-full border border-gray-300 bg-white/80 p-2 text-gray-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              🌐
            </button>
            <Link
              href="/idea"
              className="rounded-full bg-[#D3F365] px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Let&apos;s make your dream a <span className="text-[#A0D911]">reality</span>.
          <br className="hidden sm:block" /> Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-gray-700">
          Build fully-functional apps in minutes with just your words. No coding necessary.
        </p>

        {/* Interactive idea box (Client Component) */}
        <IdeaBox />

        {/* Trust bar */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-gray-600">
          <div className="flex -space-x-2">
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
          </div>
          <span>Trusted by 400K+ users</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/70 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-gray-600 sm:px-6 lg:px-8">
          <span>© {year} Business Builder</span>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}