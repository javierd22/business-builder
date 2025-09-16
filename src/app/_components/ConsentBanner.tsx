'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConsentBannerProps {
  onConsentChange?: (consented: boolean) => void;
  className?: string;
}

export default function ConsentBanner({ onConsentChange, className = "" }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [, setIsConsented] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('llm-consent');
      const consented = consent === 'true';
      setIsConsented(consented);
      setIsVisible(!consented);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm-consent', 'true');
      setIsConsented(true);
      setIsVisible(false);
      onConsentChange?.(true);
    }
  };

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm-consent', 'false');
      setIsConsented(false);
      setIsVisible(false);
      onConsentChange?.(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      role="status" 
      aria-live="polite"
      className={`bg-gradient-to-r from-brand-beige to-brand-gold border border-brand-gold rounded-lg p-4 shadow-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-brand-goldDark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-brand-goldDark mb-1">
            Privacy Notice
          </h3>
          <p className="text-sm text-text-muted mb-3">
            To generate business plans and UX designs, we need to send your content to third-party AI providers. 
            We never store your data permanently and use it only for generation purposes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-brand-gold text-white text-sm font-medium rounded-md hover:bg-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 transition-colors"
            >
              I Understand & Continue
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 bg-transparent border border-brand-gold text-brand-gold text-sm font-medium rounded-md hover:bg-brand-gold hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 transition-colors"
            >
              Decline
            </button>
            <Link
              href="/settings/privacy"
              className="px-4 py-2 text-brand-gold text-sm font-medium hover:text-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 rounded-md transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <button
          onClick={handleDecline}
          className="flex-shrink-0 text-text-muted hover:text-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 rounded-md p-1"
          aria-label="Dismiss privacy notice"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Hook to check consent status
 */
export function useConsent() {
  const [isConsented, setIsConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('llm-consent');
      setIsConsented(consent === 'true');
      setIsLoading(false);
    }
  }, []);

  return { isConsented, isLoading };
}
