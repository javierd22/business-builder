// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;            // disable ISR while we debug
export const dynamic = "force-dynamic"; // always fresh during setup

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
            <a href="#product" className="hover:text-gray-900">Product</a>
            <a href="#resources" className="hover:text-gray-900">Resources</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <a href="#enterprise" className="hover:text-gray-900">Enterprise</a>
          </nav>
          <div className="flex items-center gap-3">
            <button aria-label="Change language" className="rounded-full border border-gray-300 bg-white/80 p-2 text-gray-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
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
          Let&apos;s make your dream a <span className="text-[#A0D911]">reality</span>.<br className="hidden sm:block" />
          Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-gray-700">
          Build fully-functional apps in minutes with just your words. No coding necessary.
        </p>

        {/* Glass input panel */}
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
            <a href="/legal/privacy" className="hover:text-gray-900">Privacy</a>
            <a href="/legal/terms" className="hover:text-gray-900">Terms</a>
            <a href="/contact" className="hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function IdeaBox() {
  // simple client-ish behavior via form + progressive enhancement
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white/70 p-2 shadow-lg backdrop-blur">
      <form
        action="/idea"
        onSubmit={(e) => {
          // prevent navigation during demo; remove to let it go to /idea
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const idea = fd.get("idea");
          if (idea) {
            // For demo purposes only - remove in production
            // eslint-disable-next-line no-console
            console.log("idea:", idea);
          }
        }}
        className="relative"
        aria-label="Describe your business idea"
      >
        <textarea
          name="idea"
          placeholder="What do you want to build?"
          rows={3}
          className="w-full resize-y rounded-2xl border border-gray-300 bg-white p-4 pr-14 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-white shadow hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Submit idea"
          title="Submit idea"
        >
          ↑
        </button>
      </form>

      {/* Suggestion chips */}
      <div className="mt-3 rounded-2xl bg-white/70 p-3">
        <p className="mb-2 text-xs text-gray-600">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {["Reporting Dashboard", "Gaming Platform", "Onboarding Portal", "Networking App", "Room Visualizer"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                const ta = document.querySelector<HTMLTextAreaElement>("textarea[name='idea']");
                if (ta) {
                  ta.value = s;
                  ta.focus();
                }
              }}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}