"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import { Button } from '@/app/_components/ui/Button';
import { Input } from '@/app/_components/ui/Input';
import { Label } from '@/app/_components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/_components/ui/Select';
import { 
  getPerformanceSettings, 
  savePerformanceSettings, 
  type PerformanceSettings 
} from '@/lib/settings';
import { 
  getCacheStats, 
  clearCache, 
  isCacheEnabled, 
  setCacheEnabled,
  getCacheHitRate 
} from '@/lib/cache';
import { 
  LATENCY_TARGETS, 
  formatLatency, 
  getLatencyStatus 
} from '@/lib/latency';
import { 
  calculateDailyCost, 
  formatCost, 
  getCostEfficiencyRating 
} from '@/lib/cost-model';
import { events, clearAllEvents } from '@/lib/observability';

const PerformanceDashboard: React.FC = () => {
  const [settings, setSettings] = useState<PerformanceSettings>(getPerformanceSettings());
  const [cacheStats, setCacheStats] = useState(getCacheStats());
  const [cacheEnabled, setCacheEnabledState] = useState(isCacheEnabled());
  const [recentEvents, setRecentEvents] = useState(events(100));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setCacheStats(getCacheStats());
      setRecentEvents(events(100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      savePerformanceSettings(settings);
      // Update cache setting
      setCacheEnabled(settings.useCache);
      setCacheEnabledState(settings.useCache);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setCacheStats(getCacheStats());
  };

  const handleClearObservability = () => {
    clearAllEvents();
    setRecentEvents([]);
  };

  // Calculate performance metrics from recent events
  const planEvents = recentEvents.filter(e => e.route === '/api/plan' && e.ok);
  const uxEvents = recentEvents.filter(e => e.route === '/api/ux' && e.ok);
  
  const planLatencies = planEvents.map(e => e.ms);
  const uxLatencies = uxEvents.map(e => e.ms);
  
  const planP50 = planLatencies.length > 0 ? 
    planLatencies.sort((a, b) => a - b)[Math.floor(planLatencies.length * 0.5)] : 0;
  const planP95 = planLatencies.length > 0 ? 
    planLatencies.sort((a, b) => a - b)[Math.floor(planLatencies.length * 0.95)] : 0;
  
  const uxP50 = uxLatencies.length > 0 ? 
    uxLatencies.sort((a, b) => a - b)[Math.floor(uxLatencies.length * 0.5)] : 0;
  const uxP95 = uxLatencies.length > 0 ? 
    uxLatencies.sort((a, b) => a - b)[Math.floor(uxLatencies.length * 0.95)] : 0;

  // Calculate daily cost estimates
  const dailyCost = calculateDailyCost(recentEvents);
  const cacheHitRate = getCacheHitRate();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#8B6914]">Performance & Cost Dashboard</h1>
          <p className="text-[#6B7280] mt-2">
            Monitor latency targets, cost estimates, and performance settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-[#D4A574] hover:bg-[#C19660] text-white focus-visible:ring-[#F7DC6F]"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Targets & Performance */}
        <Card className="border border-[#E5D5B7] shadow-sm">
          <CardHeader className="bg-[#F8F4ED] border-b border-[#E5D5B7]">
            <CardTitle className="text-xl text-[#8B6914]">Latency Targets & Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Plan Performance */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#8B6914]">Plan Generation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Target p50</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {formatLatency(LATENCY_TARGETS.plan.p50)}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Target p95</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {formatLatency(LATENCY_TARGETS.plan.p95)}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Actual p50</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {planP50 > 0 ? formatLatency(planP50) : 'No data'}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Actual p95</div>
                  <div className={`text-lg font-semibold ${
                    planP95 > LATENCY_TARGETS.plan.p95 ? 'text-red-600' : 'text-[#8B6914]'
                  }`}>
                    {planP95 > 0 ? formatLatency(planP95) : 'No data'}
                  </div>
                </div>
              </div>
              {planP95 > 0 && (
                <div className="text-sm">
                  Status: <span className={`font-medium ${
                    planP95 > LATENCY_TARGETS.plan.p95 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {planP95 > LATENCY_TARGETS.plan.p95 ? 'Target Exceeded' : 'Within Target'}
                  </span>
                </div>
              )}
            </div>

            {/* UX Performance */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#8B6914]">UX Generation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Target p50</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {formatLatency(LATENCY_TARGETS.ux.p50)}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Target p95</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {formatLatency(LATENCY_TARGETS.ux.p95)}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Actual p50</div>
                  <div className="text-lg font-semibold text-[#8B6914]">
                    {uxP50 > 0 ? formatLatency(uxP50) : 'No data'}
                  </div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Actual p95</div>
                  <div className={`text-lg font-semibold ${
                    uxP95 > LATENCY_TARGETS.ux.p95 ? 'text-red-600' : 'text-[#8B6914]'
                  }`}>
                    {uxP95 > 0 ? formatLatency(uxP95) : 'No data'}
                  </div>
                </div>
              </div>
              {uxP95 > 0 && (
                <div className="text-sm">
                  Status: <span className={`font-medium ${
                    uxP95 > LATENCY_TARGETS.ux.p95 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {uxP95 > LATENCY_TARGETS.ux.p95 ? 'Target Exceeded' : 'Within Target'}
                  </span>
                </div>
              )}
            </div>

            {/* Warnings */}
            {(planP95 > LATENCY_TARGETS.plan.p95 || uxP95 > LATENCY_TARGETS.ux.p95) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-800">
                    Performance Warning: Some calls exceeded p95 targets
                  </span>
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  Consider adjusting timeout settings or enabling cache for better performance.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Estimates */}
        <Card className="border border-[#E5D5B7] shadow-sm">
          <CardHeader className="bg-[#F8F4ED] border-b border-[#E5D5B7]">
            <CardTitle className="text-xl text-[#8B6914]">Cost Estimates</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F0E8] p-4 rounded-lg">
                <div className="text-sm text-[#6B7280]">Total Calls (24h)</div>
                <div className="text-2xl font-bold text-[#8B6914]">{dailyCost.callCount}</div>
              </div>
              <div className="bg-[#F5F0E8] p-4 rounded-lg">
                <div className="text-sm text-[#6B7280]">Estimated Daily Cost</div>
                <div className="text-2xl font-bold text-[#8B6914]">
                  {formatCost(dailyCost.totalCostUSD)}
                </div>
              </div>
              <div className="bg-[#F5F0E8] p-4 rounded-lg">
                <div className="text-sm text-[#6B7280]">Average Cost per Call</div>
                <div className="text-2xl font-bold text-[#8B6914]">
                  {formatCost(dailyCost.averageCostUSD)}
                </div>
              </div>
              <div className="bg-[#F5F0E8] p-4 rounded-lg">
                <div className="text-sm text-[#6B7280]">Cache Hit Rate</div>
                <div className="text-2xl font-bold text-[#8B6914]">
                  {Math.round(cacheHitRate)}%
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            {Object.keys(dailyCost.breakdown).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#8B6914]">Cost Breakdown by Provider</h3>
                <div className="space-y-2">
                  {Object.entries(dailyCost.breakdown).map(([provider, cost]) => (
                    <div key={provider} className="flex justify-between items-center bg-[#F5F0E8] p-3 rounded-lg">
                      <span className="text-sm font-medium text-[#8B6914]">{provider}</span>
                      <span className="text-sm text-[#6B7280]">{formatCost(cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cache Statistics */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#8B6914]">Cache Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Entries</div>
                  <div className="text-lg font-semibold text-[#8B6914]">{cacheStats.entryCount}</div>
                </div>
                <div className="bg-[#F5F0E8] p-3 rounded-lg">
                  <div className="text-sm text-[#6B7280]">Total Hits</div>
                  <div className="text-lg font-semibold text-[#8B6914]">{cacheStats.totalHits}</div>
                </div>
              </div>
              <Button
                onClick={handleClearCache}
                variant="outline"
                size="sm"
                className="w-full border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8] focus-visible:ring-[#F7DC6F]"
              >
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Controls */}
      <Card className="border border-[#E5D5B7] shadow-sm">
        <CardHeader className="bg-[#F8F4ED] border-b border-[#E5D5B7]">
          <CardTitle className="text-xl text-[#8B6914]">Performance Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#8B6914]">Default Parameters</h3>
              
              <div className="space-y-3">
                <Label htmlFor="temperature" className="text-[#8B6914]">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.defaultTemperature}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    defaultTemperature: parseFloat(e.target.value) || 0.7 
                  }))}
                  className="border-[#E5D5B7] focus:ring-[#F7DC6F] focus:border-[#F7DC6F]"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="depth" className="text-[#8B6914]">Default Depth</Label>
                <Select
                  value={settings.defaultDepth}
                  onValueChange={(value: 'brief' | 'standard' | 'deep') => 
                    setSettings(prev => ({ ...prev, defaultDepth: value }))
                  }
                >
                  <SelectTrigger className="border-[#E5D5B7] focus:ring-[#F7DC6F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5D5B7] shadow-lg">
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deep">Deep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="format" className="text-[#8B6914]">Default Format</Label>
                <Select
                  value={settings.defaultFormat}
                  onValueChange={(value: 'markdown' | 'bulleted') => 
                    setSettings(prev => ({ ...prev, defaultFormat: value }))
                  }
                >
                  <SelectTrigger className="border-[#E5D5B7] focus:ring-[#F7DC6F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5D5B7] shadow-lg">
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="bulleted">Bulleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timeout Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#8B6914]">Timeout Settings</h3>
              
              <div className="space-y-3">
                <Label htmlFor="timeout" className="text-[#8B6914]">Default Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={settings.defaultTimeoutMs}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    defaultTimeoutMs: parseInt(e.target.value) || 60000 
                  }))}
                  className="border-[#E5D5B7] focus:ring-[#F7DC6F] focus:border-[#F7DC6F]"
                />
                <div className="text-xs text-[#6B7280]">
                  Recommended: 60,000ms (60s)
                </div>
              </div>
            </div>

            {/* Cache Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#8B6914]">Cache Settings</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useCache"
                  checked={settings.useCache}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    useCache: e.target.checked 
                  }))}
                  className="w-4 h-4 text-[#D4A574] bg-white border-[#E5D5B7] rounded focus:ring-[#F7DC6F] focus:ring-2"
                />
                <Label htmlFor="useCache" className="text-[#8B6914]">
                  Enable caching for faster responses
                </Label>
              </div>
              
              <div className="text-sm text-[#6B7280]">
                Cache stores recent Plan/UX outputs to avoid duplicate API calls.
              </div>

              <div className="pt-4 border-t border-[#E5D5B7]">
                <Button
                  onClick={handleClearObservability}
                  variant="outline"
                  className="w-full border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8] focus-visible:ring-[#F7DC6F]"
                >
                  Clear All Logs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;

