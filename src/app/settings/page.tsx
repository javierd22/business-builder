"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { getProfile, updateProfile } from "@/lib/storage";
import { Profile } from "@/lib/storage";
import { getTelemetrySummary } from "@/lib/telemetry";

interface SettingsData {
  provider: string;
  model: string;
  mockMode: boolean;
  showBuildInfo: boolean;
}

const PERSONAS = [
  { id: "solopreneur", title: "Solopreneur", description: "Building and running your business solo" },
  { id: "smb-owner", title: "SMB Owner", description: "Leading a small to medium business" },
  { id: "agency", title: "Agency", description: "Serving multiple clients with services" },
  { id: "pm-founder", title: "PM/Founder", description: "Product manager or startup founder" }
];

const JOBS = [
  { id: "launch-mvp", title: "Launch MVP", description: "Get a minimum viable product to market quickly" },
  { id: "validate-market", title: "Validate Market", description: "Test and prove your business concept" },
  { id: "automate-ops", title: "Automate Operations", description: "Streamline and scale your business processes" },
  { id: "pitch-deck", title: "Create Pitch Deck", description: "Present your business to investors or stakeholders" }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [telemetry, setTelemetry] = useState<ReturnType<typeof getTelemetrySummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Settings fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }

    // Load profile from localStorage
    const userProfile = getProfile();
    setProfile(userProfile);

    // Load telemetry data
    const telemetryData = getTelemetrySummary();
    setTelemetry(telemetryData);

    fetchSettings();
  }, []);

  async function updateUserProfile(newPersona: string, newJob: string) {
    setIsUpdatingProfile(true);
    setProfileError(null);

    try {
      const updatedProfile = updateProfile({
        persona: newPersona,
        job: newJob,
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7DC6F] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-[#4A5568] mb-2">Settings Error</h2>
            <p className="text-[#6B7280] mb-4">{error || 'Failed to load settings'}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">Settings</h1>
          <p className="text-lg text-[#6B7280]">Configure your Business Builder environment and LLM provider.</p>
        </div>

        {/* Profile Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#4A5568]">Your Profile</CardTitle>
            <CardDescription>
              Personalize your experience with your role and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-3">Persona</label>
                    <div className="space-y-2">
                      {PERSONAS.map((persona) => (
                        <button
                          key={persona.id}
                          onClick={() => updateUserProfile(persona.title, profile.job)}
                          disabled={isUpdatingProfile}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] disabled:opacity-50 ${
                            profile.persona === persona.title
                              ? 'border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] shadow-[0_2px_8px_rgba(247,220,111,0.2)]'
                              : 'border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] hover:border-[#F7DC6F] hover:shadow-[0_2px_8px_rgba(247,220,111,0.1)]'
                          }`}
                        >
                          <div className="font-medium text-[#4A5568]">{persona.title}</div>
                          <div className="text-sm text-[#6B7280]">{persona.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-3">Job Goal</label>
                    <div className="space-y-2">
                      {JOBS.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => updateUserProfile(profile.persona, job.title)}
                          disabled={isUpdatingProfile}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] disabled:opacity-50 ${
                            profile.job === job.title
                              ? 'border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] shadow-[0_2px_8px_rgba(247,220,111,0.2)]'
                              : 'border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] hover:border-[#F7DC6F] hover:shadow-[0_2px_8px_rgba(247,220,111,0.1)]'
                          }`}
                        >
                          <div className="font-medium text-[#4A5568]">{job.title}</div>
                          <div className="text-sm text-[#6B7280]">{job.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {profileError && (
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">{profileError}</div>
                        <div className="mt-4">
                          <Button
                            onClick={() => setProfileError(null)}
                            variant="ghost"
                            className="bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-[#6B7280] p-3 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                  <p className="font-medium text-[#8B7355] mb-1">Current Profile:</p>
                  <p>You&apos;re a <strong>{profile.persona}</strong> looking to <strong>{profile.job.toLowerCase()}</strong></p>
                  <p className="text-xs mt-1">This helps us tailor your business building experience</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-[#4A5568] mb-2">No Profile Set</h3>
                <p className="text-[#6B7280] mb-4">Complete your profile to personalize your experience</p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] rounded-lg hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Telemetry Section */}
        {telemetry && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-[#4A5568]">Usage Analytics</CardTitle>
              <CardDescription>
                Local usage statistics (stored in your browser only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A5568] mb-4">Activity Counters</h3>
                  <div className="space-y-2">
                    {Object.entries(telemetry.counters).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] border border-[#E8E9EA]">
                        <span className="text-sm text-[#4A5568] capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-medium text-[#8B7355]">
                          {value as number}
                        </span>
                      </div>
                    ))}
                    {Object.keys(telemetry.counters).length === 0 && (
                      <p className="text-sm text-[#6B7280] italic">No activity recorded yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#4A5568] mb-4">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                      <span className="text-sm text-[#4A5568]">Total Events</span>
                      <span className="text-sm font-medium text-[#8B7355]">{telemetry.totalEvents}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] border border-[#E8E9EA]">
                      <span className="text-sm text-[#4A5568]">Last Updated</span>
                      <span className="text-sm font-medium text-[#8B7355]">
                        {new Date(telemetry.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* LLM Provider Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#4A5568]">LLM Provider</CardTitle>
              <CardDescription>
                Current AI provider and model configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">Provider</p>
                  <p className="text-sm text-[#6B7280] capitalize">{settings.provider}</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">Model</p>
                  <p className="text-sm text-[#6B7280]">{settings.model}</p>
                </div>
              </div>

              <div className="text-sm text-[#6B7280] p-3 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                <p className="font-medium text-[#8B7355] mb-1">To change provider:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Update <code className="bg-white px-1 rounded">LLM_PROVIDER</code> in Vercel environment variables</li>
                  <li>Add the corresponding API key</li>
                  <li>Redeploy the application</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Environment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#4A5568]">Environment</CardTitle>
              <CardDescription>
                Current environment configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">Mock Mode</p>
                  <p className="text-sm text-[#6B7280]">
                    {settings.mockMode ? 'Enabled (Sample content)' : 'Disabled (Real AI)'}
                  </p>
                </div>
                <div className={`h-2 w-2 rounded-full ${settings.mockMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">Build Info</p>
                  <p className="text-sm text-[#6B7280]">
                    {settings.showBuildInfo ? 'Visible' : 'Hidden'}
                  </p>
                </div>
                <div className={`h-2 w-2 rounded-full ${settings.showBuildInfo ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>

              <div className="text-sm text-[#6B7280] p-3 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                <p className="font-medium text-[#8B7355] mb-1">Environment Variables:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><code className="bg-white px-1 rounded">LLM_PROVIDER</code> - anthropic or openai</li>
                  <li><code className="bg-white px-1 rounded">ANTHROPIC_API_KEY</code> - Your Anthropic API key</li>
                  <li><code className="bg-white px-1 rounded">OPENAI_API_KEY</code> - Your OpenAI API key</li>
                  <li><code className="bg-white px-1 rounded">NEXT_PUBLIC_MOCK_AI</code> - true/false</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#4A5568]">API Keys</CardTitle>
              <CardDescription>
                Status of your API keys (keys are never exposed)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">Anthropic API Key</p>
                  <p className="text-sm text-[#6B7280]">
                    {settings.provider === 'anthropic' ? 'Configured' : 'Not required'}
                  </p>
                </div>
                <div className={`h-2 w-2 rounded-full ${settings.provider === 'anthropic' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                <div>
                  <p className="font-medium text-[#4A5568]">OpenAI API Key</p>
                  <p className="text-sm text-[#6B7280]">
                    {settings.provider === 'openai' ? 'Configured' : 'Not required'}
                  </p>
                </div>
                <div className={`h-2 w-2 rounded-full ${settings.provider === 'openai' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#4A5568]">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                className="w-full justify-start border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
              >
                Open Vercel Dashboard
              </Button>

              <Button
                onClick={() => window.open('https://console.anthropic.com/', '_blank')}
                className="w-full justify-start border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
              >
                Anthropic Console
              </Button>

              <Button
                onClick={() => window.open('https://platform.openai.com/', '_blank')}
                className="w-full justify-start border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
              >
                OpenAI Platform
              </Button>

              <Button
                onClick={() => window.location.reload()}
                className="w-full justify-start bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
              >
                Refresh Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
