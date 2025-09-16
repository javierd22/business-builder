import Link from "next/link";
import Image from "next/image";
import IdeaBox from "./_components/IdeaBox";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8]">
      <div 
        className="min-h-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top left, rgba(255, 236, 179, 0.4), transparent 60%),
            radial-gradient(ellipse at bottom right, rgba(248, 250, 252, 0.6), transparent 60%),
            linear-gradient(135deg, rgba(255, 248, 220, 0.3) 0%, rgba(245, 245, 220, 0.3) 50%, rgba(255, 250, 240, 0.3) 100%)
          `
        }}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-[#E8E9EA] bg-gradient-to-r from-white/95 via-[#FEFEFE]/95 to-white/95 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-[#4A5568]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] text-[#8B7355]">●</span>
              <span>Business Builder</span>
            </Link>
            <nav className="hidden gap-6 text-sm text-[#4A5568] md:flex">
              <Link href="#product" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-2 py-1 rounded">Product</Link>
              <Link href="#resources" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-2 py-1 rounded">Resources</Link>
              <Link href="#pricing" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-2 py-1 rounded">Pricing</Link>
              <Link href="#enterprise" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-2 py-1 rounded">Enterprise</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button
                aria-label="Change language"
                className="rounded-full border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] p-2 text-[#6B7280] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all"
              >
                🌐
              </button>
              <Link
                href="/idea"
                className="rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] px-4 py-2 text-sm font-medium text-[#8B7355] shadow-[0_2px_8px_rgba(247,220,111,0.3)] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
              >
                Start Building
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
          <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-[#4A5568] sm:text-6xl md:text-7xl">
            Let&apos;s make your dream a <span className="bg-gradient-to-r from-[#F7DC6F] via-[#F4D03F] to-[#F7DC6F] bg-clip-text text-transparent font-extrabold drop-shadow-[0_2px_4px_rgba(247,220,111,0.3)]">reality</span>.
            <br className="hidden sm:block" /> Right now.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[#6B7280]">
            Transform your business ideas into structured plans and professional presentations in minutes.
          </p>

          <IdeaBox />

          {/* Trust bar */}
          <div className="mt-12 flex items-center justify-center gap-3 text-sm text-[#6B7280]">
            <div className="flex -space-x-2">
              <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.2)]" />
              <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.2)]" />
              <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.2)]" />
            </div>
            <span>Trusted by 400K+ users</span>
          </div>
        </section>

        {/* Your Business Workspace */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A5568] sm:text-4xl mb-4">
              Your Business Workspace
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Manage your projects, track progress, and bring your ideas to life with our comprehensive business building platform.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] px-4 py-3 pl-10 text-[#4A5568] shadow-[0_2px_8px_rgba(0,0,0,0.04)] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F7DC6F] focus-visible:ring-2 focus-visible:ring-[#F7DC6F] focus:shadow-[0_4px_12px_rgba(247,220,111,0.15)] transition-all"
              />
              <div className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]">
                🔍
              </div>
            </div>
            <div className="flex gap-2">
              <select className="rounded-lg border-2 border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] px-4 py-2 text-[#4A5568] shadow-[0_1px_3px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#D1D5DB] focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all">
                <option>All Projects</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Planning</option>
              </select>
              <button className="rounded-lg bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] px-4 py-2 text-[#8B7355] font-medium shadow-[0_2px_8px_rgba(247,220,111,0.3)] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]">
                + New Project
              </button>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sample Project Card 1 */}
            <div className="rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#F7DC6F]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#A7F3D0] to-[#6EE7B7] shadow-[0_1px_3px_rgba(34,197,94,0.3)]"></div>
                  <span className="text-sm font-medium text-[#6B7280]">Active</span>
                </div>
                <button className="text-[#9CA3AF] hover:text-[#D4A574] transition-colors">⋯</button>
              </div>
              <h3 className="text-lg font-bold text-[#4A5568] mb-2">E-commerce Platform</h3>
              <p className="text-[#6B7280] text-sm mb-4">A modern online store with payment processing and inventory management</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Updated 2 hours ago</span>
                <Link href="/dashboard/1" className="text-[#D4A574] hover:text-[#F7DC6F] font-medium text-sm transition-colors">
                  View →
                </Link>
              </div>
            </div>

            {/* Sample Project Card 2 */}
            <div className="rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#F7DC6F]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#FCD34D] to-[#FBBF24] shadow-[0_1px_3px_rgba(245,158,11,0.3)]"></div>
                  <span className="text-sm font-medium text-[#6B7280]">Planning</span>
                </div>
                <button className="text-[#9CA3AF] hover:text-[#D4A574] transition-colors">⋯</button>
              </div>
              <h3 className="text-lg font-bold text-[#4A5568] mb-2">Task Management App</h3>
              <p className="text-[#6B7280] text-sm mb-4">Team collaboration tool with real-time updates and progress tracking</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Updated 1 day ago</span>
                <Link href="/dashboard/2" className="text-[#D4A574] hover:text-[#F7DC6F] font-medium text-sm transition-colors">
                  View →
                </Link>
              </div>
            </div>

            {/* Sample Project Card 3 */}
            <div className="rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#F7DC6F]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#93C5FD] to-[#60A5FA] shadow-[0_1px_3px_rgba(59,130,246,0.3)]"></div>
                  <span className="text-sm font-medium text-[#6B7280]">Deployed</span>
                </div>
                <button className="text-[#9CA3AF] hover:text-[#D4A574] transition-colors">⋯</button>
              </div>
              <h3 className="text-lg font-bold text-[#4A5568] mb-2">Analytics Dashboard</h3>
              <p className="text-[#6B7280] text-sm mb-4">Business intelligence platform with custom reporting and data visualization</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Updated 3 days ago</span>
                <Link href="/dashboard/3" className="text-[#D4A574] hover:text-[#F7DC6F] font-medium text-sm transition-colors">
                  View →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E8E9EA] bg-gradient-to-r from-white/95 via-[#FEFEFE]/95 to-white/95 py-6 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-[#6B7280] sm:px-6 lg:px-8">
            <span>© {year} Business Builder</span>
            <nav className="flex gap-4">
              <Link href="/legal/privacy" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-colors px-2 py-1 rounded">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-colors px-2 py-1 rounded">Terms</Link>
              <Link href="/contact" className="hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-colors px-2 py-1 rounded">Contact</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}