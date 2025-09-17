'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { decodeShareHash } from '@/lib/share';
import { PRESETS } from '@/design/presets';
import { shufflePreset } from '@/design/layout-variants';
import DesignRenderer from '@/design/DesignRenderer';
import { SharePayload } from '@/lib/share';
import { getButtonClass, getFocusRingClass } from '@/design/styles';

export default function SharePreviewPage() {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      const decoded = decodeShareHash(hash);
      
      if (decoded) {
        setPayload(decoded);
      } else {
        setError('Invalid or corrupted share link');
      }
    } catch (err) {
      console.error('Error loading share preview:', err);
      setError('Failed to load preview');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Preview Not Available</h1>
            <p className="text-amber-700 mb-6">
              {error || 'This share link is invalid or has expired.'}
            </p>
            <Link
              href="/"
              className={`inline-flex items-center ${getButtonClass('minimal', 'md')} ${getFocusRingClass('minimal')}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the preset
  const preset = PRESETS[payload.vertical]?.find(p => p.id === payload.presetId) || PRESETS[payload.vertical]?.[0];
  
  if (!preset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Preview Not Found</h1>
            <p className="text-amber-700 mb-6">
              The preset for this preview is no longer available.
            </p>
            <Link
              href="/"
              className={`inline-flex items-center ${getButtonClass('minimal', 'md')} ${getFocusRingClass('minimal')}`}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Shuffle preset with a deterministic seed
  const shuffledPreset = shufflePreset(preset, payload.content.brandName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8]">
      {/* Slim top bar */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] text-[#8B7355]">●</span>
            <span className="font-semibold text-[#8B7355]">Shared Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {payload.vertical.replace('_', ' ')} • {payload.style}
            </span>
            <Link
              href="/"
              className={`text-sm ${getButtonClass('minimal', 'sm')} ${getFocusRingClass('minimal')}`}
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      {/* Preview content */}
      <main>
        <DesignRenderer
          preset={shuffledPreset}
          content={payload.content}
          style={payload.style}
        />
      </main>

      {/* Footer */}
      <footer className="bg-amber-50 border-t border-amber-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-amber-700">
            This is a shared preview from{' '}
            <Link href="/" className="font-medium text-amber-800 hover:text-amber-900 underline">
              Business Builder
            </Link>
            . Create your own business mock in minutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
