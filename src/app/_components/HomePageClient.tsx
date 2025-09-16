'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { getVariant } from '@/lib/experiments';
import { recordEvent } from '@/lib/observability';
import { init } from '@/lib/perf';

export default function HomePageClient() {
  useEffect(() => {
    // Initialize performance monitoring
    init();
    
    // Record page view
    recordEvent({
      name: 'view',
      route: '/',
      ok: true,
      ms: 0
    });
  }, []);

  const heroVariant = getVariant('hero_copy_v1');
  
  const heroContent = {
    A: {
      headline: "Transform your business ideas into structured plans and professional presentations in minutes.",
      subheadline: "Build fully-functional business strategies with just your words. No coding necessary."
    },
    B: {
      headline: "Turn your vision into reality with AI-powered business planning.",
      subheadline: "Create comprehensive business plans, UX designs, and deployment strategies in minutes."
    }
  };

  const currentHero = heroContent[heroVariant as keyof typeof heroContent] || heroContent.A;

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
                onClick={() => {
                  recordEvent({
                    name: 'cta',
                    route: '/',
                    ok: true,
                    ms: 0,
                    meta: { action: 'start-building' }
                  });
                }}
                className="rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] px-4 py-2 text-sm font-medium text-[#8B7355] shadow-[0_2px_8px_rgba(247,220,111,0.3)] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
              >
                Start Building
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-[#2D3748] sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-[#8B7355] via-[#A0522D] to-[#8B4513] bg-clip-text text-transparent">
                  {currentHero.headline}
                </span>
              </h1>
              <p className="mt-6 text-lg text-[#4A5568] sm:text-xl">
                {currentHero.subheadline}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/idea"
                onClick={() => {
                  recordEvent({
                    name: 'cta',
                    route: '/',
                    ok: true,
                    ms: 0,
                    meta: { action: 'get-started', variant: heroVariant }
                  });
                }}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] px-8 py-4 text-lg font-semibold text-[#8B7355] shadow-[0_4px_16px_rgba(247,220,111,0.4)] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_6px_20px_rgba(247,220,111,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9E6] via-[#FFF4C4] to-[#FFECB3] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="#product"
                className="group rounded-full border border-[#E8E9EA] bg-white/80 px-6 py-4 text-lg font-medium text-[#4A5568] backdrop-blur-sm hover:border-[#D1D5DB] hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all"
              >
                Learn More
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Rest of the page content would go here */}
        <div className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-8">
              Your Business Workspace
            </h2>
            <p className="text-lg text-[#4A5568] mb-12">
              Create, manage, and deploy your business ideas with our comprehensive suite of tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
