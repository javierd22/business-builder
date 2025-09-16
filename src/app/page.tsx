// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import IdeaBox from "./_components/IdeaBox";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <main
      className={[
        "min-h-screen overflow-x-hidden",
        // Beige + gold glow: radial beige, subtle gold wash from bottom
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F7F1E8] via-[#F2E6D3] to-transparent",
        "[background-image:linear-gradient(180deg,transparent,rgba(212,175,55,0.30))]",
      ].join(" ")}
    >
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#E5E9EF] bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-[#1F2937]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4891E] text-white">●</span>
            <span>Business Builder</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-[#1F2937] md:flex">
            <Link href="#product" className="hover:text-[#1F2937]/90">Product</Link>
            <Link href="#resources" className="hover:text-[#1F2937]/90">Resources</Link>
            <Link href="#pricing" className="hover:text-[#1F2937]/90">Pricing</Link>
            <Link href="#enterprise" className="hover:text-[#1F2937]/90">Enterprise</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              aria-label="Change language"
              className="rounded-full border border-[#E5E9EF] bg-white/80 p-2 text-[#1F2937] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              🌐
            </button>
            <Link
              href="/idea"
              className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1F2937] shadow-sm hover:bg-[#B4891E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-[#1F2937] sm:text-6xl md:text-7xl">
          Let&apos;s make your dream a <span className="text-[#D4AF37]">reality</span>.
          <br className="hidden sm:block" /> Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[#6B7280]">
          Build fully-functional apps in minutes with just your words. No coding necessary.
        </p>

        <IdeaBox />

        {/* Trust bar */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-[#6B7280]">
          <div className="flex -space-x-2">
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
          </div>
          <span>Trusted by 400K+ users</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E9EF] bg-white/80 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-[#6B7280] sm:px-6 lg:px-8">
          <span>© {year} Business Builder</span>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-[#1F2937]">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-[#1F2937]">Terms</Link>
            <Link href="/contact" className="hover:text-[#1F2937]">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}