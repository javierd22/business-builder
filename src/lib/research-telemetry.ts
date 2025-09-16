/**
 * Research telemetry for tracking micro-survey results locally
 * Stores tallies and notes per assumption without network calls
 */

import type { AssumptionId } from './assumptions';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export interface SurveyResult {
  assumptionId: AssumptionId;
  choice: string;
  note?: string;
  timestamp: string;
}

export interface SurveySummary {
  assumptionId: AssumptionId;
  counts: Record<string, number>;
  totalResponses: number;
  lastUpdated: string;
}

const RESEARCH_TELEMETRY_KEY = 'business-builder-research-telemetry';
const MAX_NOTES = 20;

interface ResearchData {
  results: SurveyResult[];
  pageCompletions: Record<string, number>;
}

function getResearchData(): ResearchData {
  if (!isClient()) return { results: [], pageCompletions: {} };
  
  try {
    const stored = localStorage.getItem(RESEARCH_TELEMETRY_KEY);
    if (!stored) {
      return { results: [], pageCompletions: {} };
    }
    
    const parsed = JSON.parse(stored);
    return {
      results: Array.isArray(parsed.results) ? parsed.results : [],
      pageCompletions: parsed.pageCompletions || {}
    };
  } catch (error) {
    console.warn('Failed to load research data:', error);
    return { results: [], pageCompletions: {} };
  }
}

function saveResearchData(data: ResearchData): void {
  if (!isClient()) return;
  
  try {
    localStorage.setItem(RESEARCH_TELEMETRY_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save research data:', error);
  }
}

export function recordSurvey(assumptionId: AssumptionId, choice: string, note?: string): void {
  if (!isClient()) return;
  
  const data = getResearchData();
  
  const result: SurveyResult = {
    assumptionId,
    choice,
    note,
    timestamp: new Date().toISOString()
  };
  
  data.results.unshift(result);
  
  // Keep only the last MAX_NOTES per assumption
  const assumptionResults = data.results.filter(r => r.assumptionId === assumptionId);
  if (assumptionResults.length > MAX_NOTES) {
    data.results = data.results.filter(r => 
      r.assumptionId !== assumptionId || 
      assumptionResults.slice(0, MAX_NOTES).includes(r)
    );
  }
  
  saveResearchData(data);
}

export function summary(): SurveySummary[] {
  if (!isClient()) return [];
  
  const data = getResearchData();
  const summaries = new Map<AssumptionId, SurveySummary>();
  
  for (const result of data.results) {
    if (!summaries.has(result.assumptionId)) {
      summaries.set(result.assumptionId, {
        assumptionId: result.assumptionId,
        counts: {},
        totalResponses: 0,
        lastUpdated: result.timestamp
      });
    }
    
    const summary = summaries.get(result.assumptionId)!;
    summary.counts[result.choice] = (summary.counts[result.choice] || 0) + 1;
    summary.totalResponses++;
    
    if (result.timestamp > summary.lastUpdated) {
      summary.lastUpdated = result.timestamp;
    }
  }
  
  return Array.from(summaries.values());
}

export function recentNotes(assumptionId: AssumptionId, limit: number = 10): string[] {
  if (!isClient()) return [];
  
  const data = getResearchData();
  return data.results
    .filter(r => r.assumptionId === assumptionId && r.note)
    .slice(0, limit)
    .map(r => r.note!)
    .filter(Boolean);
}

export function recordPageCompletion(page: string): void {
  if (!isClient()) return;
  
  const data = getResearchData();
  data.pageCompletions[page] = (data.pageCompletions[page] || 0) + 1;
  saveResearchData(data);
}

export function getPageCompletions(): Record<string, number> {
  if (!isClient()) return {};
  
  const data = getResearchData();
  return data.pageCompletions;
}

export function exportResearchData(): string {
  if (!isClient()) return '{}';
  
  const data = getResearchData();
  const summaryData = summary();
  
  const exportData = {
    timestamp: new Date().toISOString(),
    summaries: summaryData,
    pageCompletions: data.pageCompletions,
    recentResults: data.results.slice(0, 50) // Last 50 results for context
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function clearResearchData(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem(RESEARCH_TELEMETRY_KEY);
  } catch (error) {
    console.warn('Failed to clear research data:', error);
  }
}
