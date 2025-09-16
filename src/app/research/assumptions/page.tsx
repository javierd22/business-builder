'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import { Textarea } from '@/app/_components/ui/Textarea';
import { 
  listAssumptions, 
  upsertAssumption, 
  resetAllAssumptions, 
  getAssumptionTitle,
  type Assumption,
  type AssumptionStatus,
  type AssumptionPriority,
  type AssumptionId
} from '@/lib/assumptions';

export default function AssumptionsPage() {
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [editingEvidence, setEditingEvidence] = useState<Record<string, string>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setAssumptions(listAssumptions());
  }, []);

  const refreshAssumptions = () => {
    setAssumptions(listAssumptions());
  };

  const handleStatusChange = (id: string, status: AssumptionStatus) => {
    upsertAssumption({ id: id as AssumptionId, status });
    refreshAssumptions();
  };

  const handleEvidenceChange = (id: string, evidence: string) => {
    setEditingEvidence(prev => ({ ...prev, [id]: evidence }));
  };

  const handleEvidenceSave = (id: string) => {
    const evidence = editingEvidence[id];
    if (evidence !== undefined) {
      upsertAssumption({ id: id as AssumptionId, evidence });
      refreshAssumptions();
      setEditingEvidence(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleReset = () => {
    resetAllAssumptions();
    refreshAssumptions();
    setShowResetConfirm(false);
  };

  const sortedAssumptions = [...assumptions].sort((a, b) => {
    const priorityOrder: Record<AssumptionPriority, number> = { P0: 0, P1: 1, P2: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: AssumptionPriority) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800 border-red-200';
      case 'P1': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P2': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: AssumptionStatus) => {
    switch (status) {
      case 'validated': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'invalidated': return 'bg-red-100 text-red-800 border-red-200';
      case 'unvalidated': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8B6914]">Research Assumptions</h1>
              <p className="mt-2 text-[#8B6914]/70">
                Track and validate key assumptions about user needs and product value.
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
          <div className="lg:col-span-2 space-y-4">
            {sortedAssumptions.map((assumption) => (
              <Card key={assumption.id} className="border-[#E5D5B7]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#8B6914]">
                        {getAssumptionTitle(assumption.id as AssumptionId)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(assumption.priority)}`}>
                          {assumption.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(assumption.status)}`}>
                          {assumption.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor={`evidence-${assumption.id}`} className="block text-sm font-medium text-[#8B6914] mb-2">
                      Evidence & Notes
                    </label>
                    <Textarea
                      id={`evidence-${assumption.id}`}
                      value={editingEvidence[assumption.id] ?? assumption.evidence}
                      onChange={(e) => handleEvidenceChange(assumption.id, e.target.value)}
                      placeholder="Add evidence, observations, or notes..."
                      rows={3}
                    />
                    {editingEvidence[assumption.id] !== undefined && (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          onClick={() => handleEvidenceSave(assumption.id)}
                          size="sm"
                          className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                        >
                          Save Evidence
                        </Button>
                        <Button 
                          onClick={() => setEditingEvidence(prev => {
                            const updated = { ...prev };
                            delete updated[assumption.id];
                            return updated;
                          })}
                          size="sm"
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusChange(assumption.id, 'validated')}
                      disabled={assumption.status === 'validated'}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    >
                      Mark Validated
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(assumption.id, 'invalidated')}
                      disabled={assumption.status === 'invalidated'}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                      Mark Invalidated
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(assumption.id, 'unvalidated')}
                      disabled={assumption.status === 'unvalidated'}
                      size="sm"
                      variant="secondary"
                    >
                      Reset
                    </Button>
                  </div>
                  
                  {assumption.updatedAt && (
                    <p className="text-xs text-[#8B6914]/60">
                      Last updated: {new Date(assumption.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914]">Quick Experiments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-[#8B6914]/70 space-y-2">
                  <p>Micro-surveys appear at key steps to validate assumptions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Idea page:</strong> Local-only storage acceptance</li>
                    <li><strong>PRD review:</strong> First draft value</li>
                    <li><strong>Deploy page:</strong> Deploy link satisfaction</li>
                    <li><strong>Pricing page:</strong> Willingness to pay</li>
                    <li><strong>UX preview:</strong> Export needs</li>
                  </ul>
                </div>
                <Link 
                  href="/settings/research"
                  className="block w-full text-center px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-white rounded font-medium text-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                >
                  View Research Insights
                </Link>
              </CardContent>
            </Card>

            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914]">Reset Data</CardTitle>
              </CardHeader>
              <CardContent>
                {!showResetConfirm ? (
                  <Button
                    onClick={() => setShowResetConfirm(true)}
                    variant="secondary"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reset All Assumptions
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600">
                      This will reset all assumptions to &quot;unvalidated&quot; and clear evidence. Are you sure?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleReset}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Reset
                      </Button>
                      <Button
                        onClick={() => setShowResetConfirm(false)}
                        size="sm"
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}