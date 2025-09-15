// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import IdeaBox from "./_components/IdeaBox";

export const revalidate = 0;            // keep fresh while we debug deploys
export const dynamic = "force-dynamic"; // avoid stale HTML

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-lavender via-brand-periwinkle to-transparent [background-image:linear-gradient(180deg,transparent,rgba(255,179,123,0.55))]">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface-glass backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-text">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-text-onBrand">●</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-text-muted md:flex">
            <Link href="#product" className="hover:text-text">Product</Link>
            <Link href="#resources" className="hover:text-text">Resources</Link>
            <Link href="#pricing" className="hover:text-text">Pricing</Link>
            <Link href="#enterprise" className="hover:text-text">Enterprise</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              aria-label="Change language"
              className="rounded-full border border-border bg-surface-glass p-2 text-text-muted hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
            >
              🌐
            </button>
            <Link
              href="/idea"
              className="rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-text-onLime shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container pb-24 pt-16 lg:pb-32 lg:pt-24">
        <h1 className="mx-auto text-center text-5xl font-black leading-tight tracking-tight text-text sm:text-6xl md:text-7xl">
          Let&apos;s make your dream a <span className="bg-brand-lime px-3 py-1 rounded-full text-text-onLime">reality</span>.
          <br className="hidden sm:block" /> Right now.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-text-muted">
          Build fully-functional apps in minutes with just your words. No coding necessary.
        </p>

        {/* Interactive idea box (Client Component) */}
        <IdeaBox />

        {/* Trust bar */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-text-muted">
          <div className="flex -space-x-2">
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=1" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=2" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
            <Image alt="User avatar" src="https://i.pravatar.cc/36?img=3" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-white" />
          </div>
          <span>Trusted by 400K+ users</span>
        </div>
      </section>

      {/* Workspace Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Your Business Workspace</h2>
            <p className="text-gray-300">Manage and access all your created businesses</p>
          </div>
          
          {/* Workspace Controls */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
        <input
                  type="text"
                  placeholder="Search projects..."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last edited</option>
                <option>Date created</option>
                <option>Alphabetical</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All creators</option>
                <option>Created by me</option>
                <option>Shared with me</option>
              </select>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Sample Project Cards */}
            <Link href="/dashboard/0" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 p-6 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.85 9 11 5.16-1.15 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Health Tracker</h3>
                  </div>
                </div>
                <div className="bg-gray-800 p-4">
                  <p className="text-gray-300 text-sm line-clamp-2">A comprehensive health and wellness tracking application for daily fitness goals.</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">2 days ago</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-xs text-gray-400">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/1" className="group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-emerald-400 to-teal-500 p-6 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Sales Dashboard</h3>
                  </div>
                </div>
                <div className="bg-gray-800 p-4">
                  <p className="text-gray-300 text-sm line-clamp-2">Real-time sales analytics and reporting dashboard for e-commerce businesses.</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">1 week ago</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span className="text-xs text-gray-400">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/2" className="group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 p-6 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Task Manager</h3>
                  </div>
                </div>
                <div className="bg-gray-800 p-4">
                  <p className="text-gray-300 text-sm line-clamp-2">Collaborative task management tool with team features and deadline tracking.</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">3 weeks ago</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-xs text-gray-400">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Create New Project Card */}
            <Link href="/idea" className="group">
              <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl overflow-hidden hover:border-gray-500 transition-all duration-300 group-hover:bg-gray-750">
                <div className="aspect-video p-6 flex items-center justify-center">
                  <div className="text-gray-400 text-center group-hover:text-gray-300 transition-colors">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">New Project</h3>
                  </div>
                </div>
                <div className="bg-gray-800 p-4">
                  <p className="text-gray-400 text-sm text-center">Start building something amazing</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-glass py-6 backdrop-blur">
        <div className="container flex items-center justify-between text-sm text-text-muted">
          <span>© {year} Business Builder</span>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-text">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-text">Terms</Link>
            <Link href="/contact" className="hover:text-text">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}