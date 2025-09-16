import Link from "next/link";
import Image from "next/image";
import { Button } from "./_components/ui/Button";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-metal-silverLight bg-white/80 backdrop-blur shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-text-DEFAULT">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-white">●</span>
            <span>Business Builder</span>
          </Link>
          
          <nav className="hidden gap-6 text-sm text-text-muted md:flex">
            <Link href="#product" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Product</Link>
            <Link href="#resources" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Resources</Link>
            <Link href="#pricing" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Pricing</Link>
            <Link href="#enterprise" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Enterprise</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <button
              aria-label="Change language"
              className="rounded-full border border-metal-silverLight bg-white p-2 text-text-muted hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring-gold shadow-soft transition-all"
            >
              🌐
            </button>
            <Button href="/idea" variant="primary" size="md">
              Start Building
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-text-DEFAULT sm:text-6xl md:text-7xl">
          Let&apos;s make your dream a <span className="text-brand-gold font-extrabold">reality</span>.
          <br className="hidden sm:block" /> Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-text-muted">
          Transform your business ideas into structured plans and professional presentations in minutes.
        </p>

        {/* Idea Input */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-metal-silverLight bg-white p-3 shadow-soft">
          <div className="relative">
            <textarea
              placeholder="What do you want to build?"
              rows={3}
              className="w-full resize-y rounded-xl border border-metal-silverLight bg-white p-4 pr-14 text-text-DEFAULT placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring-gold focus:border-ring-gold transition-all"
              readOnly
            />
            <Link
              href="/idea"
              className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-white hover:bg-brand-goldDark focus:outline-none focus:ring-2 focus:ring-ring-gold transition-all transform hover:scale-110 font-bold text-lg"
              aria-label="Start building"
              title="Start building"
            >
              ↑
            </Link>
          </div>

          <div className="mt-3 rounded-xl bg-gray-50 border border-metal-silverLight p-3">
            <p className="mb-2 text-xs text-text-muted font-medium">Not sure where to start? Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {["Reporting Dashboard", "Gaming Platform", "Onboarding Portal", "Networking App", "Room Visualizer"].map((suggestion) => (
                <Link
                  key={suggestion}
                  href="/idea"
                  className="rounded-full border border-metal-silverLight bg-white px-3 py-1 text-sm text-text-DEFAULT transition-all hover:-translate-y-0.5 hover:shadow-soft hover:border-brand-gold focus:outline-none focus:ring-2 focus:ring-ring-gold font-medium"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-text-muted">
          <div className="flex -space-x-2">
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-brand-gold shadow-soft" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-brand-gold shadow-soft" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-brand-gold shadow-soft" />
          </div>
          <span>Trusted by 400K+ users</span>
        </div>
      </section>

      {/* Your Business Workspace */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-DEFAULT sm:text-4xl mb-4">
            Your Business Workspace
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Manage your projects, track progress, and bring your ideas to life with our comprehensive business building platform.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-xl border border-metal-silverLight bg-white px-4 py-3 pl-10 text-text-DEFAULT shadow-soft placeholder:text-text-muted focus:outline-none focus:border-ring-gold focus:ring-2 focus:ring-ring-gold transition-all"
            />
            <div className="absolute left-3 top-3.5 h-4 w-4 text-text-muted">
              🔍
            </div>
          </div>
          <div className="flex gap-2">
            <select className="rounded-lg border border-metal-silverLight bg-white px-4 py-2 text-text-DEFAULT shadow-soft focus:outline-none focus:border-ring-gold focus:ring-2 focus:ring-ring-gold transition-all">
              <option>All Projects</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Planning</option>
            </select>
            <Button variant="primary" size="md">
              + New Project
            </Button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample Project Card 1 */}
          <div className="rounded-xl border border-metal-silverLight bg-white p-6 shadow-soft transition-all hover:shadow-lg hover:-translate-y-1 hover:border-brand-gold">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-text-muted">Active</span>
              </div>
              <button className="text-text-muted hover:text-brand-gold transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-text-DEFAULT mb-2">E-commerce Platform</h3>
            <p className="text-text-muted text-sm mb-4">A modern online store with payment processing and inventory management</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Updated 2 hours ago</span>
              <Link href="/dashboard/1" className="text-brand-gold hover:text-brand-goldDark font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>

          {/* Sample Project Card 2 */}
          <div className="rounded-xl border border-metal-silverLight bg-white p-6 shadow-soft transition-all hover:shadow-lg hover:-translate-y-1 hover:border-brand-gold">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium text-text-muted">Planning</span>
              </div>
              <button className="text-text-muted hover:text-brand-gold transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-text-DEFAULT mb-2">Task Management App</h3>
            <p className="text-text-muted text-sm mb-4">Team collaboration tool with real-time updates and progress tracking</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Updated 1 day ago</span>
              <Link href="/dashboard/2" className="text-brand-gold hover:text-brand-goldDark font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>

          {/* Sample Project Card 3 */}
          <div className="rounded-xl border border-metal-silverLight bg-white p-6 shadow-soft transition-all hover:shadow-lg hover:-translate-y-1 hover:border-brand-gold">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-text-muted">Deployed</span>
              </div>
              <button className="text-text-muted hover:text-brand-gold transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-text-DEFAULT mb-2">Analytics Dashboard</h3>
            <p className="text-text-muted text-sm mb-4">Business intelligence platform with custom reporting and data visualization</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Updated 3 days ago</span>
              <Link href="/dashboard/3" className="text-brand-gold hover:text-brand-goldDark font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-metal-silverLight bg-white/80 backdrop-blur py-6 shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-text-muted sm:px-6 lg:px-8">
          <span>© {year} Business Builder</span>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Terms</Link>
            <Link href="/contact" className="hover:text-brand-gold transition-colors px-2 py-1 rounded">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}