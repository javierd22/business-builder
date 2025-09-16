'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import { 
  summary, 
  recentNotes, 
  exportResearchData, 
  clearResearchData,
  type SurveySummary 
} from '@/lib/research-telemetry';
import { getAssumptionTitle, listAssumptions, type AssumptionId, type Assumption } from '@/lib/assumptions';

export default function ResearchInsightsPage() {
  const [summaries, setSummaries] = useState<SurveySummary[]>([]);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [selectedAssumption, setSelectedAssumption] = useState<AssumptionId | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setSummaries(summary());
    setAssumptions(listAssumptions());
  }, []);

  useEffect(() => {
    if (selectedAssumption) {
      setNotes(recentNotes(selectedAssumption, 10));
    }
  }, [selectedAssumption]);

  const handleExport = () => {
    const data = exportResearchData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-insights-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearResearchData();
    setSummaries([]);
    setNotes([]);
    setShowClearConfirm(false);
  };

  const getAssumptionStatus = (assumptionId: string) => {
    const assumption = assumptions.find(a => a.id === assumptionId);
    return assumption?.status || 'unvalidated';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'text-emerald-600';
      case 'invalidated': return 'text-red-600';
      case 'unvalidated': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8B6914]">Research Insights</h1>
              <p className="mt-2 text-[#8B6914]/70">
                Summary of micro-survey responses and user feedback.
              </p>
            </div>
            <Link 
              href="/settings"
              className="text-sm text-[#8B6914] hover:text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded px-2 py-1"
            >
              ← Back to Settings
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914]">Survey Results</CardTitle>
              </CardHeader>
              <CardContent>
                {summaries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#8B6914]/70">No survey responses yet.</p>
                    <p className="text-sm text-[#8B6914]/60 mt-2">
                      Visit key pages in your app to see micro-surveys and start collecting feedback.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E5D5B7]">
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Assumption</th>
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Status</th>
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Responses</th>
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Results</th>
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Notes</th>
                          <th className="text-left py-2 text-sm font-medium text-[#8B6914]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summaries.map((summary) => (
                          <tr key={summary.assumptionId} className="border-b border-[#E5D5B7]/50">
                            <td className="py-3 pr-4">
                              <div className="text-sm font-medium text-[#8B6914]">
                                {getAssumptionTitle(summary.assumptionId)}
                              </div>
                              <div className="text-xs text-[#8B6914]/60">
                                {summary.assumptionId}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`text-sm font-medium ${getStatusColor(getAssumptionStatus(summary.assumptionId))}`}>
                                {getAssumptionStatus(summary.assumptionId)}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-sm text-[#8B6914]">
                                {summary.totalResponses}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="space-y-1">
                                {Object.entries(summary.counts).map(([choice, count]) => (
                                  <div key={choice} className="flex items-center gap-2">
                                    <span className="text-xs text-[#8B6914]/70">{choice}:</span>
                                    <span className="text-xs font-medium text-[#8B6914]">{count}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-xs text-[#8B6914]/70">
                                {recentNotes(summary.assumptionId, 1).length > 0 ? '📝' : '—'}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setSelectedAssumption(summary.assumptionId)}
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  View Notes
                                </Button>
                                <Link 
                                  href="/research/assumptions"
                                  className="text-xs px-2 py-1 text-[#D4AF37] hover:text-[#B8941F] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                                >
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedAssumption && (
              <Card className="border-[#E5D5B7]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#8B6914]">
                      Notes: {getAssumptionTitle(selectedAssumption)}
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedAssumption(null)}
                      size="sm"
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <p className="text-[#8B6914]/70 text-sm">No notes available for this assumption.</p>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note, index) => (
                        <div key={index} className="p-3 bg-[#F8F4ED] rounded border border-[#E5D5B7]">
                          <p className="text-sm text-[#8B6914]">&quot;{note}&quot;</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914]">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleExport}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                >
                  Export Research JSON
                </Button>
                
                {!showClearConfirm ? (
                  <Button
                    onClick={() => setShowClearConfirm(true)}
                    variant="secondary"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear Research Data
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600">
                      This will permanently delete all survey responses and notes. Are you sure?
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleClear}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Clear All Data
                      </Button>
                      <Button
                        onClick={() => setShowClearConfirm(false)}
                        variant="secondary"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914]">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  href="/research/assumptions"
                  className="block w-full text-center px-3 py-2 text-sm bg-[#F8F4ED] hover:bg-[#F5F0E8] text-[#8B6914] rounded border border-[#E5D5B7] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                >
                  Manage Assumptions
                </Link>
                <Link 
                  href="/settings/privacy"
                  className="block w-full text-center px-3 py-2 text-sm bg-[#F8F4ED] hover:bg-[#F5F0E8] text-[#8B6914] rounded border border-[#E5D5B7] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                >
                  Privacy Settings
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
