'use client';

import { useState, useEffect } from { 'react' };
import Link from 'next/link';
import { exportAllData } from '@/lib/storage-health';

export default function PrivacyPage() {
  const [consent, setConsent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consentValue = localStorage.getItem('llm-consent');
      setConsent(consentValue === 'true');
    }
  }, []);

  const handleConsentToggle = () => {
    if (typeof window !== 'undefined') {
      const newConsent = !consent;
      localStorage.setItem('llm-consent', newConsent.toString());
      setConsent(newConsent);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-builder-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all local data? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        if (typeof window !== 'undefined') {
          // Clear all app-specific localStorage keys
          const keysToRemove = [
            'projects',
            'profile',
            'llm-consent',
            'telemetry',
            'quality-feedback',
            'experiments',
            'observability',
            'snapshots'
          ];
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Clear all snapshots
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('snapshot_')) {
              localStorage.removeItem(key);
            }
          }
        }
        alert('All local data has been cleared.');
      } catch (error) {
        console.error('Clear data failed:', error);
        alert('Failed to clear data. Please try again.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-beige via-white to-brand-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-goldDark mb-2">
              Privacy & Data
            </h1>
            <p className="text-text-muted">
              Manage your privacy settings and local data
            </p>
          </div>

          <div className="space-y-8">
            {/* Consent Status */}
            <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
              <h2 className="text-xl font-semibold text-brand-goldDark mb-4">
                AI Provider Consent
              </h2>
              
              <div className="flex items-center justify-between p-4 bg-brand-beige/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-brand-goldDark">
                    Send content to AI providers
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    Allow sending your business ideas to third-party AI services for plan and UX generation
                  </p>
                </div>
                <button
                  onClick={handleConsentToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${
                    consent ? 'bg-brand-gold' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={consent}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      consent ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Data Transparency */}
            <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
              <h2 className="text-xl font-semibold text-brand-goldDark mb-4">
                Data Transparency
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">What we send to AI providers:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Your business idea text (for plan generation)</li>
                    <li>• Your PRD content (for UX generation)</li>
                    <li>• Your persona and job-to-be-done (for context)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2">What we never send:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Personal information (emails, phone numbers, addresses)</li>
                    <li>• Financial data or sensitive business information</li>
                    <li>• Any data beyond what you explicitly provide</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Current AI providers:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Anthropic Claude (when API key is configured)</li>
                    <li>• OpenAI ChatGPT (when API key is configured)</li>
                    <li>• Mock mode (when no API keys are configured)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
              <h2 className="text-xl font-semibold text-brand-goldDark mb-4">
                Data Management
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-beige/30 rounded-lg">
                  <div>
                    <h3 className="font-medium text-brand-goldDark">
                      Export All Data
                    </h3>
                    <p className="text-sm text-text-muted">
                      Download all your local data as a JSON file
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="px-4 py-2 bg-brand-gold text-white text-sm font-medium rounded-md hover:bg-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isExporting ? 'Exporting...' : 'Export Data'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-800">
                      Delete All Data
                    </h3>
                    <p className="text-sm text-red-700">
                      Permanently remove all local data from this device
                    </p>
                  </div>
                  <button
                    onClick={handleClearData}
                    disabled={isClearing}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isClearing ? 'Deleting...' : 'Delete All Data'}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Link
                href="/settings"
                className="px-4 py-2 text-brand-gold hover:text-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 rounded-md transition-colors"
              >
                ← Back to Settings
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-brand-gold text-white rounded-md hover:bg-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
