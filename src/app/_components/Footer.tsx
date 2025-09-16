'use client';

import React from 'react';
import Link from 'next/link';
import { shouldShowResearch, shouldShowDocLinks } from '@/lib/flags';

export default function Footer() {
  return (
    <footer className="bg-[#F8F4ED] border-t border-[#E5D5B7] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-[#8B6914] uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/idea"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Create Business Plan
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-sm font-semibold text-[#8B6914] uppercase tracking-wider mb-4">
              Settings
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/settings"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  General
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings/privacy"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Privacy & Data
                </Link>
              </li>
              <li>
                <Link 
                  href="/onboarding"
                  className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Research (conditional) */}
          {shouldShowResearch() && (
            <div>
              <h3 className="text-sm font-semibold text-[#8B6914] uppercase tracking-wider mb-4">
                Research
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/research/assumptions"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    Assumptions
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/settings/research"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    Insights
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/settings/logs"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Documentation (conditional) */}
          {shouldShowDocLinks() && (
            <div>
              <h3 className="text-sm font-semibold text-[#8B6914] uppercase tracking-wider mb-4">
                Documentation
              </h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/javierd22/business-builder/blob/main/docs/MESSAGING_BRIEF.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    Messaging Brief
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/javierd22/business-builder/blob/main/docs/MVP_DEFINITION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    MVP Definition
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/javierd22/business-builder/blob/main/docs/ACCESSIBILITY_CRITERIA.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    Accessibility
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/javierd22/business-builder/blob/main/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B6914]/70 hover:text-[#8B6914] text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                  >
                    All Docs →
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Empty column for spacing when docs are hidden */}
          {!shouldShowDocLinks() && <div></div>}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#E5D5B7]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-[#8B6914]/60">
              © 2024 Business Builder. Built with Next.js and AI.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                href="/settings/privacy"
                className="text-sm text-[#8B6914]/60 hover:text-[#8B6914] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
              >
                Privacy
              </Link>
              <a 
                href="https://github.com/javierd22/business-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#8B6914]/60 hover:text-[#8B6914] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
              >
                GitHub
              </a>
              {shouldShowResearch() && (
                <Link 
                  href="/settings/research"
                  className="text-sm text-[#8B6914]/60 hover:text-[#8B6914] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                >
                  Research
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
