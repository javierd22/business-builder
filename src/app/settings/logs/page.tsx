'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getStats, clearEvents, exportEvents, getSessionId } from '@/lib/observability';

export default function LogsPage() {
  const [events, setEvents] = useState(getEvents(50));
  const [stats, setStats] = useState(getStats());
  const [sessionId, setSessionId] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    setEvents(getEvents(50));
    setStats(getStats());
    setSessionId(getSessionId());
  }, []);

  const handleExportLogs = async () => {
    setIsExporting(true);
    try {
      const data = exportEvents();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-builder-logs-${new Date().toISOString().split('T')[0]}.json`;
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

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        clearEvents();
        setEvents([]);
        setStats(getStats());
        alert('All logs have been cleared.');
      } catch (error) {
        console.error('Clear logs failed:', error);
        alert('Failed to clear logs. Please try again.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (ok: boolean) => {
    return ok ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (ok: boolean) => {
    return ok ? 'Success' : 'Failed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-beige via-white to-brand-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-goldDark mb-2">
              Observability & Logs
            </h1>
            <p className="text-text-muted">
              Monitor API performance and system health
            </p>
          </div>

          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
                <h3 className="text-lg font-semibold text-brand-goldDark mb-4">
                  Plan Generation
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total Calls:</span>
                    <span className="font-medium">{stats.plan.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Success Rate:</span>
                    <span className="font-medium">{stats.plan.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Avg Time:</span>
                    <span className="font-medium">{stats.plan.avgMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">P95 Time:</span>
                    <span className="font-medium">{stats.plan.p95Ms}ms</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
                <h3 className="text-lg font-semibold text-brand-goldDark mb-4">
                  UX Generation
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total Calls:</span>
                    <span className="font-medium">{stats.ux.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Success Rate:</span>
                    <span className="font-medium">{stats.ux.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Avg Time:</span>
                    <span className="font-medium">{stats.ux.avgMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">P95 Time:</span>
                    <span className="font-medium">{stats.ux.p95Ms}ms</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
                <h3 className="text-lg font-semibold text-brand-goldDark mb-4">
                  Deployment
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total Calls:</span>
                    <span className="font-medium">{stats.deploy.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Success Rate:</span>
                    <span className="font-medium">{stats.deploy.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Avg Time:</span>
                    <span className="font-medium">{stats.deploy.avgMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">P95 Time:</span>
                    <span className="font-medium">{stats.deploy.p95Ms}ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Snapshot */}
            <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
              <h2 className="text-xl font-semibold text-brand-goldDark mb-4">
                Growth Snapshot
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-brand-goldDark mb-2">Session Info</h3>
                  <p className="text-sm text-text-muted">Session ID: {sessionId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-brand-goldDark mb-2">Total Events</h3>
                  <p className="text-sm text-text-muted">
                    {events.length} events recorded (showing last 50)
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Events Table */}
            <div className="bg-white rounded-lg shadow-lg border border-brand-gold/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-brand-goldDark">
                  Recent Events
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportLogs}
                    disabled={isExporting}
                    className="px-4 py-2 bg-brand-gold text-white text-sm font-medium rounded-md hover:bg-brand-goldDark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isExporting ? 'Exporting...' : 'Export Logs'}
                  </button>
                  <button
                    onClick={handleClearLogs}
                    disabled={isClearing}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isClearing ? 'Clearing...' : 'Clear Logs'}
                  </button>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  No events recorded yet. Start using the app to see performance data.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <caption className="sr-only">
                      Recent telemetry events with timestamps, routes, status, and performance metrics
                    </caption>
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Meta
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTimestamp(event.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.route}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getStatusColor(event.ok)}`}>
                              {getStatusText(event.ok)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.ms}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Object.keys(event.meta || {}).length > 0 ? (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {Object.keys(event.meta || {}).length} fields
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
