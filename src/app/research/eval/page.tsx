'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import { Textarea } from '@/app/_components/ui/Textarea';
import { Input } from '@/app/_components/ui/Input';
import EvalRunner from '@/app/_components/EvalRunner';
import SideBySide, { type ComparableRun } from '@/app/_components/SideBySide';
import { 
  createSet, 
  listSets, 
  deleteSet,
  addItem, 
  listItems, 
  deleteItem,
  bulkCreateItems,
  exportSet,
  importSet,
  type EvalSet,
  type EvalItem
} from '@/lib/evalsets';
import { 
  listRunsBySet, 
  latestRun,
  getSetSummary,
  type EvalRun 
} from '@/lib/eval-store';
import { 
  getScore
} from '@/lib/eval-quality';
import { 
  exportEvaluationJSON, 
  exportEvaluationCSV, 
  exportEvaluationSummary
} from '@/lib/eval-export';
import { EVALUATION_DEFAULTS, getRecommendedParams } from '@/lib/eval-config';

export default function EvaluationHarnessPage() {
  const [sets, setSets] = useState<EvalSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [items, setItems] = useState<EvalItem[]>([]);
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [activeTab, setActiveTab] = useState<'plan' | 'ux'>('plan');
  
  // Set management
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [showCreateSet, setShowCreateSet] = useState(false);
  
  // Item management
  const [newItemIdea, setNewItemIdea] = useState('');
  const [newItemPersona, setNewItemPersona] = useState('');
  const [newItemJob, setNewItemJob] = useState('');
  const [bulkItems, setBulkItems] = useState('');
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  
  // Evaluation parameters
  const [params, setParams] = useState({
    temperature: EVALUATION_DEFAULTS.temperature,
    depth: EVALUATION_DEFAULTS.depth,
    format: EVALUATION_DEFAULTS.format,
    revision: '',
    promptVersion: EVALUATION_DEFAULTS.promptVersions[0],
  });
  
  // Provider overrides (dev-only)
  const [providerOverride, setProviderOverride] = useState<'anthropic' | 'openai' | undefined>();
  const [modelOverride, setModelOverride] = useState('');
  const [allowOverrides] = useState(process.env.NODE_ENV !== 'production');
  
  // Comparison
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonRuns, setComparisonRuns] = useState<ComparableRun[]>([]);
  
  // Scoring (for future implementation)
  // const [selectedRunForScoring, setSelectedRunForScoring] = useState<string>('');
  // const [showScoringModal, setShowScoringModal] = useState(false);
  
  // Import/Export
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    setSets(listSets());
  }, []);

  useEffect(() => {
    if (selectedSetId) {
      setItems(listItems(selectedSetId));
      setRuns(listRunsBySet(selectedSetId));
    } else {
      setItems([]);
      setRuns([]);
    }
  }, [selectedSetId]);

  const refreshData = () => {
    setSets(listSets());
    if (selectedSetId) {
      setItems(listItems(selectedSetId));
      setRuns(listRunsBySet(selectedSetId));
    }
  };

  const handleCreateSet = () => {
    if (newSetName.trim()) {
      createSet(newSetName.trim(), newSetDescription.trim());
      setNewSetName('');
      setNewSetDescription('');
      setShowCreateSet(false);
      refreshData();
    }
  };

  const handleDeleteSet = (setId: string) => {
    if (window.confirm('Are you sure you want to delete this set? This will also delete all items and runs.')) {
      deleteSet(setId);
      if (selectedSetId === setId) {
        setSelectedSetId('');
      }
      refreshData();
    }
  };

  const handleAddItem = () => {
    if (selectedSetId && newItemIdea.trim()) {
      addItem(selectedSetId, {
        idea: newItemIdea.trim(),
        persona: newItemPersona.trim() || undefined,
        job: newItemJob.trim() || undefined,
      });
      setNewItemIdea('');
      setNewItemPersona('');
      setNewItemJob('');
      refreshData();
    }
  };

  const handleBulkCreateItems = () => {
    if (selectedSetId && bulkItems.trim()) {
      bulkCreateItems(selectedSetId, bulkItems.trim(), newItemPersona.trim() || undefined, newItemJob.trim() || undefined);
      setBulkItems('');
      setShowBulkCreate(false);
      refreshData();
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId);
      refreshData();
    }
  };

  const handleExportSet = (setId: string) => {
    const data = exportSet(setId);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evaluation_set_${data.set.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportSet = () => {
    try {
      const data = JSON.parse(importData);
      const result = importSet(data);
      if (result.success) {
        setImportData('');
        setShowImport(false);
        refreshData();
        if (result.setId) {
          setSelectedSetId(result.setId);
        }
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch {
      alert('Invalid JSON format');
    }
  };

  const handleShowComparison = (itemId: string) => {
    const itemRuns = runs.filter(run => run.itemId === itemId);
    const comparableRuns: ComparableRun[] = itemRuns.map(run => ({
      id: run.id,
      provider: run.provider,
      model: run.model,
      paramsHash: run.paramsHash,
      outputText: run.outputText,
      ms: run.ms,
      ok: run.ok,
      createdAt: run.createdAt,
      temperature: run.params.temperature,
      depth: run.params.depth,
      format: run.params.format,
      promptVersion: run.promptVersion,
    }));
    setComparisonRuns(comparableRuns);
    setShowComparison(true);
  };

  const handleScoreRun = (runId: string) => {
    // TODO: Implement scoring modal
    console.log('Score run:', runId);
  };

  const setSummary = selectedSetId ? getSetSummary(selectedSetId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#4A5568]">Evaluation Harness</h1>
              <p className="mt-2 text-lg text-[#6B7280]">
                Run curated idea sets through Plan and UX generation for systematic evaluation
              </p>
            </div>
            <Link 
              href="/settings"
              className="text-sm text-[#D4A574] hover:text-[#B8941F] focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2 rounded px-2 py-1"
            >
              ← Back to Settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Sets and Items */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sets Management */}
            <Card className="border-[#E5D5B7]">
              <CardHeader>
                <CardTitle className="text-[#8B6914] flex items-center justify-between">
                  Evaluation Sets
                  <Button
                    onClick={() => setShowCreateSet(!showCreateSet)}
                    size="sm"
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  >
                    {showCreateSet ? 'Cancel' : 'New Set'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showCreateSet && (
                  <div className="space-y-3 p-3 bg-[#F8F4ED] border border-[#E5D5B7] rounded-lg">
                    <Input
                      placeholder="Set name"
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={newSetDescription}
                      onChange={(e) => setNewSetDescription(e.target.value)}
                      rows={2}
                    />
                    <Button
                      onClick={handleCreateSet}
                      disabled={!newSetName.trim()}
                      className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                    >
                      Create Set
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {sets.map(set => (
                    <div
                      key={set.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSetId === set.id
                          ? 'bg-[#D4AF37] text-white border-[#B8941F]'
                          : 'bg-[#F8F4ED] border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]'
                      }`}
                      onClick={() => setSelectedSetId(set.id)}
                    >
                      <div className="font-medium">{set.name}</div>
                      <div className="text-xs opacity-75">{set.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs">
                          {listItems(set.id).length} items
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleExportSet(set.id)}
                            size="sm"
                            variant="secondary"
                            className="text-xs px-2 py-1"
                          >
                            Export
                          </Button>
                          <Button
                            onClick={() => handleDeleteSet(set.id)}
                            size="sm"
                            variant="secondary"
                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Import Set */}
                <div className="pt-4 border-t border-[#E5D5B7]">
                  <Button
                    onClick={() => setShowImport(!showImport)}
                    variant="secondary"
                    className="w-full border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]"
                  >
                    {showImport ? 'Cancel Import' : 'Import Set'}
                  </Button>
                  {showImport && (
                    <div className="mt-3 space-y-3">
                      <Textarea
                        placeholder="Paste JSON data here..."
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        rows={4}
                      />
                      <Button
                        onClick={handleImportSet}
                        disabled={!importData.trim()}
                        className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                      >
                        Import
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items Management */}
            {selectedSetId && (
              <Card className="border-[#E5D5B7]">
                <CardHeader>
                  <CardTitle className="text-[#8B6914] flex items-center justify-between">
                    Items
                    <Button
                      onClick={() => setShowBulkCreate(!showBulkCreate)}
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                    >
                      {showBulkCreate ? 'Single' : 'Bulk'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showBulkCreate ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Business idea"
                        value={newItemIdea}
                        onChange={(e) => setNewItemIdea(e.target.value)}
                      />
                      <Input
                        placeholder="Persona (optional)"
                        value={newItemPersona}
                        onChange={(e) => setNewItemPersona(e.target.value)}
                      />
                      <Input
                        placeholder="Job to be done (optional)"
                        value={newItemJob}
                        onChange={(e) => setNewItemJob(e.target.value)}
                      />
                      <Button
                        onClick={handleAddItem}
                        disabled={!newItemIdea.trim()}
                        className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                      >
                        Add Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="One idea per line. Optional: idea: persona: job"
                        value={bulkItems}
                        onChange={(e) => setBulkItems(e.target.value)}
                        rows={6}
                      />
                      <Input
                        placeholder="Default persona (optional)"
                        value={newItemPersona}
                        onChange={(e) => setNewItemPersona(e.target.value)}
                      />
                      <Input
                        placeholder="Default job (optional)"
                        value={newItemJob}
                        onChange={(e) => setNewItemJob(e.target.value)}
                      />
                      <Button
                        onClick={handleBulkCreateItems}
                        disabled={!bulkItems.trim()}
                        className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                      >
                        Create Items
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="p-2 bg-[#F8F4ED] border border-[#E5D5B7] rounded text-sm">
                        <div className="font-medium text-[#8B6914] truncate">
                          {item.idea}
                        </div>
                        {item.persona && (
                          <div className="text-xs text-[#6B7280]">
                            Persona: {item.persona}
                          </div>
                        )}
                        {item.job && (
                          <div className="text-xs text-[#6B7280]">
                            Job: {item.job}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-[#6B7280]">
                            {runs.filter(run => run.itemId === item.id).length} runs
                          </div>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            size="sm"
                            variant="secondary"
                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedSetId ? (
              <>
                {/* Evaluation Runner */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        onClick={() => setActiveTab('plan')}
                        variant={activeTab === 'plan' ? 'primary' : 'secondary'}
                        className={activeTab === 'plan' 
                          ? 'bg-[#D4AF37] hover:bg-[#B8941F] text-white' 
                          : 'border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]'
                        }
                      >
                        Plan Generation
                      </Button>
                      <Button
                        onClick={() => setActiveTab('ux')}
                        variant={activeTab === 'ux' ? 'primary' : 'secondary'}
                        className={activeTab === 'ux' 
                          ? 'bg-[#D4AF37] hover:bg-[#B8941F] text-white' 
                          : 'border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]'
                        }
                      >
                        UX Generation
                      </Button>
                    </div>

                    <EvalRunner
                      setId={selectedSetId}
                      step={activeTab}
                      params={params}
                      providerOverride={providerOverride}
                      modelOverride={modelOverride}
                      onComplete={refreshData}
                    />
                  </div>

                  {/* Parameters */}
                  <Card className="border-[#E5D5B7]">
                    <CardHeader>
                      <CardTitle className="text-[#8B6914]">Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#8B6914] mb-1">
                          Temperature
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={params.temperature}
                          onChange={(e) => setParams(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B6914] mb-1">
                          Depth
                        </label>
                        <select
                          value={params.depth}
                          onChange={(e) => setParams(prev => ({ ...prev, depth: e.target.value as 'brief' | 'standard' | 'deep' }))}
                          className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        >
                          <option value="brief">Brief</option>
                          <option value="standard">Standard</option>
                          <option value="deep">Deep</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B6914] mb-1">
                          Format
                        </label>
                        <select
                          value={params.format}
                          onChange={(e) => setParams(prev => ({ ...prev, format: e.target.value as 'markdown' | 'bulleted' }))}
                          className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        >
                          <option value="markdown">Markdown</option>
                          <option value="bulleted">Bulleted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B6914] mb-1">
                          Prompt Version
                        </label>
                        <select
                          value={params.promptVersion}
                          onChange={(e) => setParams(prev => ({ ...prev, promptVersion: e.target.value }))}
                          className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        >
                          {EVALUATION_DEFAULTS.promptVersions.map(version => (
                            <option key={version} value={version}>{version}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8B6914] mb-1">
                          Revision Notes
                        </label>
                        <Textarea
                          placeholder="Optional revision instructions..."
                          value={params.revision}
                          onChange={(e) => setParams(prev => ({ ...prev, revision: e.target.value }))}
                          rows={2}
                        />
                      </div>

                      {/* Quick Parameter Presets */}
                      <div className="pt-4 border-t border-[#E5D5B7]">
                        <div className="text-sm font-medium text-[#8B6914] mb-2">Quick Presets</div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setParams(prev => ({ ...prev, ...getRecommendedParams('quick') }))}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Quick
                          </Button>
                          <Button
                            onClick={() => setParams(prev => ({ ...prev, ...getRecommendedParams('thorough') }))}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Thorough
                          </Button>
                          <Button
                            onClick={() => setParams(prev => ({ ...prev, ...getRecommendedParams('creative') }))}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Creative
                          </Button>
                        </div>
                      </div>

                      {/* Provider Overrides (dev-only) */}
                      {allowOverrides && (
                        <div className="pt-4 border-t border-[#E5D5B7]">
                          <div className="text-sm font-medium text-[#8B6914] mb-2">Provider Override (Dev Only)</div>
                          <div className="space-y-2">
                            <select
                              value={providerOverride || ''}
                              onChange={(e) => setProviderOverride(e.target.value as 'anthropic' | 'openai' | undefined)}
                              className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            >
                              <option value="">Use default provider</option>
                              <option value="anthropic">Anthropic</option>
                              <option value="openai">OpenAI</option>
                            </select>
                            <Input
                              placeholder="Model override (optional)"
                              value={modelOverride}
                              onChange={(e) => setModelOverride(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Results Summary */}
                {setSummary && (
                  <Card className="border-[#E5D5B7]">
                    <CardHeader>
                      <CardTitle className="text-[#8B6914] flex items-center justify-between">
                        Results Summary
                        <div className="flex gap-2">
                          <Button
                            onClick={() => exportEvaluationJSON(selectedSetId)}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Export JSON
                          </Button>
                          <Button
                            onClick={() => exportEvaluationCSV(selectedSetId)}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Export CSV
                          </Button>
                          <Button
                            onClick={() => exportEvaluationSummary(selectedSetId)}
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
                            Export Summary
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#8B6914]">{setSummary.totalRuns}</div>
                          <div className="text-sm text-[#6B7280]">Total Runs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{setSummary.successfulRuns}</div>
                          <div className="text-sm text-[#6B7280]">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{setSummary.failedRuns}</div>
                          <div className="text-sm text-[#6B7280]">Failed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#8B6914]">{setSummary.averageMs}ms</div>
                          <div className="text-sm text-[#6B7280]">Avg Time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results Table */}
                <Card className="border-[#E5D5B7]">
                  <CardHeader>
                    <CardTitle className="text-[#8B6914]">Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#E5D5B7]">
                        <thead className="bg-[#F8F4ED]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Step
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Provider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#8B6914] uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#E5D5B7]">
                          {runs.map(run => {
                            const item = items.find(item => item.id === run.itemId);
                            const score = getScore(run.id);
                            const latestRunForItem = latestRun(selectedSetId, run.itemId, run.step);
                            const isLatest = latestRunForItem?.id === run.id;
                            
                            return (
                              <tr key={run.id} className={isLatest ? 'bg-[#F8F4ED]' : ''}>
                                <td className="px-6 py-4 text-sm text-[#4A5568] max-w-xs truncate">
                                  {item?.idea}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#4A5568]">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    run.step === 'plan' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {run.step.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#4A5568]">
                                  {run.provider} {run.model}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#4A5568]">
                                  {run.ms}ms
                                </td>
                                <td className="px-6 py-4 text-sm text-[#4A5568]">
                                  {score ? (
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      score.status === 'ship' 
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : score.status === 'revise'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {score.weightedAverage.toFixed(1)}/5.0
                                    </span>
                                  ) : (
                                    <span className="text-[#9CA3AF]">Not scored</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#4A5568]">
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => handleScoreRun(run.id)}
                                      size="sm"
                                      variant="secondary"
                                      className="text-xs px-2 py-1"
                                    >
                                      Score
                                    </Button>
                                    <Button
                                      onClick={() => handleShowComparison(run.itemId)}
                                      size="sm"
                                      variant="secondary"
                                      className="text-xs px-2 py-1"
                                    >
                                      Compare
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparison Modal */}
                {showComparison && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                      <SideBySide
                        runs={comparisonRuns}
                        onClose={() => setShowComparison(false)}
                      />
                    </div>
                  </div>
                )}

                {/* Data Privacy Notice */}
                <Card className="border-[#E5D5B7] bg-[#F8F4ED]">
                  <CardContent className="p-4">
                    <div className="text-sm text-[#8B6914]">
                      <strong>🔒 Local-Only Data:</strong> All evaluation data is stored locally in your browser. 
                      No data is sent to external servers. Your evaluation sets, runs, and scores remain private.
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-[#E5D5B7]">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold text-[#8B6914] mb-4">
                    Select an Evaluation Set
                  </h3>
                  <p className="text-[#6B7280] mb-6">
                    Choose a set from the sidebar or create a new one to start evaluating.
                  </p>
                  <Button
                    onClick={() => setShowCreateSet(true)}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  >
                    Create Your First Set
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
