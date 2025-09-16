// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import IdeaBox from "./_components/IdeaBox";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#F5F1E8] via-[#F0E6D2] to-[#EAD5B7]">
      <div 
        className="min-h-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top left, rgba(255, 215, 0, 0.15), transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(255, 165, 0, 0.1), transparent 50%)
          `
        }}
      >
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#C0C4CC] bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-[#2D1B02]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-white shadow-lg">●</span>
            <span>Business Builder</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-[#2D1B02] md:flex">
            <Link href="#product" className="hover:text-[#FFD700] transition-colors">Product</Link>
            <Link href="#resources" className="hover:text-[#FFD700] transition-colors">Resources</Link>
            <Link href="#pricing" className="hover:text-[#FFD700] transition-colors">Pricing</Link>
            <Link href="#enterprise" className="hover:text-[#FFD700] transition-colors">Enterprise</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              aria-label="Change language"
              className="rounded-full border border-[#C0C4CC] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] p-2 text-[#2D1B02] hover:from-[#E9ECEF] hover:to-[#DEE2E6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] shadow-sm transition-all"
            >
              🌐
            </button>
            <Link
              href="/idea"
              className="rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] px-4 py-2 text-sm font-semibold text-[#2D1B02] shadow-lg hover:from-[#FFED4E] hover:via-[#FFD700] hover:to-[#FFA500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all transform hover:scale-105"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-[#2D1B02] sm:text-6xl md:text-7xl">
          Let&apos;s make your dream a <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent font-extrabold">reality</span>.
          <br className="hidden sm:block" /> Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[#5D4E37]">
          Build fully-functional apps in minutes with just your words. No coding necessary.
        </p>

        <IdeaBox />

        {/* Trust bar */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-[#5D4E37]">
          <div className="flex -space-x-2">
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#FFD700] shadow-sm" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#FFD700] shadow-sm" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#FFD700] shadow-sm" />
          </div>
          <span>Trusted by 400K+ users</span>
        </div>
      </section>

      {/* Your Business Workspace */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2D1B02] sm:text-4xl mb-4">
            Your Business Workspace
          </h2>
          <p className="text-lg text-[#5D4E37] max-w-2xl mx-auto">
            Manage your projects, track progress, and bring your ideas to life with our comprehensive business building platform.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-xl border-2 border-[#C0C4CC] bg-white px-4 py-3 pl-10 text-[#2D1B02] shadow-sm placeholder:text-[#8B7355] focus:outline-none focus:border-[#FFD700] focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all"
            />
            <div className="absolute left-3 top-3.5 h-4 w-4 text-[#8B7355]">
              🔍
            </div>
          </div>
          <div className="flex gap-2">
            <select className="rounded-lg border-2 border-[#C0C4CC] bg-white px-4 py-2 text-[#2D1B02] focus:outline-none focus:border-[#FFD700] focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all">
              <option>All Projects</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Planning</option>
            </select>
            <button className="rounded-lg bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] px-4 py-2 text-[#2D1B02] font-semibold shadow-lg hover:from-[#FFED4E] hover:via-[#FFD700] hover:to-[#FFA500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all transform hover:scale-105">
              + New Project
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample Project Card 1 */}
          <div className="rounded-xl border-2 border-[#C0C4CC] bg-white/95 p-6 shadow-lg backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#22C55E]"></div>
                <span className="text-sm font-medium text-[#5D4E37]">Active</span>
              </div>
              <button className="text-[#8B7355] hover:text-[#FFD700] transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-[#2D1B02] mb-2">E-commerce Platform</h3>
            <p className="text-[#5D4E37] text-sm mb-4">A modern online store with payment processing and inventory management</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B7355]">Updated 2 hours ago</span>
              <Link href="/dashboard/1" className="text-[#FFD700] hover:text-[#FFA500] font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>

          {/* Sample Project Card 2 */}
          <div className="rounded-xl border-2 border-[#C0C4CC] bg-white/95 p-6 shadow-lg backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
                <span className="text-sm font-medium text-[#5D4E37]">Planning</span>
              </div>
              <button className="text-[#8B7355] hover:text-[#FFD700] transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-[#2D1B02] mb-2">Task Management App</h3>
            <p className="text-[#5D4E37] text-sm mb-4">Team collaboration tool with real-time updates and progress tracking</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B7355]">Updated 1 day ago</span>
              <Link href="/dashboard/2" className="text-[#FFD700] hover:text-[#FFA500] font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>

          {/* Sample Project Card 3 */}
          <div className="rounded-xl border-2 border-[#C0C4CC] bg-white/95 p-6 shadow-lg backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#3B82F6]"></div>
                <span className="text-sm font-medium text-[#5D4E37]">Deployed</span>
              </div>
              <button className="text-[#8B7355] hover:text-[#FFD700] transition-colors">⋯</button>
            </div>
            <h3 className="text-lg font-bold text-[#2D1B02] mb-2">Analytics Dashboard</h3>
            <p className="text-[#5D4E37] text-sm mb-4">Business intelligence platform with custom reporting and data visualization</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B7355]">Updated 3 days ago</span>
              <Link href="/dashboard/3" className="text-[#FFD700] hover:text-[#FFA500] font-medium text-sm transition-colors">
                View →
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State (if no projects) */}
        <div className="text-center py-12 hidden">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] flex items-center justify-center mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-[#2D1B02] mb-2">No projects yet</h3>
          <p className="text-[#5D4E37] mb-6">Start building your first project and watch your ideas come to life.</p>
          <button className="rounded-lg bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] px-6 py-3 text-[#2D1B02] font-semibold shadow-lg hover:from-[#FFED4E] hover:via-[#FFD700] hover:to-[#FFA500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all transform hover:scale-105">
            Create Your First Project
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C0C4CC] bg-white/90 py-6 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-[#5D4E37] sm:px-6 lg:px-8">
          <span>© {year} Business Builder</span>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-[#FFD700] transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-[#FFD700] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#FFD700] transition-colors">Contact</Link>
          </nav>
        </div>
      </footer>
      </div>
    </div>
  );
}