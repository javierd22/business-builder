/**
 * Export utilities for evaluation data
 * JSON, CSV, and Markdown export functions
 */

import { listSets, getSet, listItems } from './evalsets';
import { listRunsBySet, type EvalRun } from './eval-store';
import { getScore, type EvaluationScore } from './eval-quality';

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Download a file in the browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  if (!isClient()) return;
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export evaluation data as JSON
 */
export function exportEvaluationJSON(setId: string): boolean {
  if (!isClient()) return false;
  
  try {
    const set = getSet(setId);
    if (!set) return false;
    
    const items = listItems(setId);
    const runs = listRunsBySet(setId);
    const scores: EvaluationScore[] = [];
    
    // Get scores for all runs
    runs.forEach(run => {
      const score = getScore(run.id);
      if (score) {
        scores.push(score);
      }
    });
    
    const exportData = {
      set,
      items,
      runs,
      scores,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    
    const filename = `evaluation_${set.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
    
    return true;
  } catch (error) {
    console.error('Failed to export evaluation JSON:', error);
    return false;
  }
}

/**
 * Export evaluation data as CSV
 */
export function exportEvaluationCSV(setId: string): boolean {
  if (!isClient()) return false;
  
  try {
    const set = getSet(setId);
    if (!set) return false;
    
    const runs = listRunsBySet(setId);
    
    // CSV headers
    const headers = [
      'set_id',
      'set_name',
      'item_id',
      'item_idea',
      'item_persona',
      'item_job',
      'step',
      'provider',
      'model',
      'params_hash',
      'temperature',
      'depth',
      'format',
      'prompt_version',
      'ms',
      'avg_score',
      'status',
      'created_at'
    ];
    
    // CSV rows
    const rows = runs.map(run => {
      const score = getScore(run.id);
      const item = listItems(setId).find(item => item.id === run.itemId);
      
      return [
        run.setId,
        set?.name || '',
        run.itemId,
        `"${(item?.idea || '').replace(/"/g, '""')}"`,
        item?.persona || '',
        item?.job || '',
        run.step,
        run.provider,
        run.model,
        run.paramsHash,
        run.params.temperature,
        run.params.depth,
        run.params.format,
        run.promptVersion || '',
        run.ms,
        score?.weightedAverage || '',
        score?.status || '',
        run.createdAt
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const filename = `evaluation_${set.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    
    return true;
  } catch (error) {
    console.error('Failed to export evaluation CSV:', error);
    return false;
  }
}

/**
 * Export evaluation summary as Markdown
 */
export function exportEvaluationSummary(setId: string): boolean {
  if (!isClient()) return false;
  
  try {
    const set = getSet(setId);
    if (!set) return false;
    
    const items = listItems(setId);
    const runs = listRunsBySet(setId);
    const scores: EvaluationScore[] = [];
    
    // Get scores for all runs
    runs.forEach(run => {
      const score = getScore(run.id);
      if (score) {
        scores.push(score);
      }
    });
    
    // Group runs by provider and model
    const providerGroups: Record<string, EvalRun[]> = {};
    runs.forEach(run => {
      const key = `${run.provider}_${run.model}`;
      if (!providerGroups[key]) {
        providerGroups[key] = [];
      }
      providerGroups[key].push(run);
    });
    
    // Calculate statistics
    const totalRuns = runs.length;
    const successfulRuns = runs.filter(run => run.ok).length;
    const averageMs = totalRuns > 0 ? Math.round(runs.reduce((sum, run) => sum + run.ms, 0) / totalRuns) : 0;
    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score.weightedAverage, 0) / scores.length : 0;
    
    const statusCounts = {
      ship: scores.filter(s => s.status === 'ship').length,
      revise: scores.filter(s => s.status === 'revise').length,
      reject: scores.filter(s => s.status === 'reject').length,
    };
    
    // Generate Markdown content
    const markdown = `# Evaluation Summary: ${set.name}

**Generated:** ${new Date().toLocaleString()}

## Overview

- **Set:** ${set.name}
- **Description:** ${set.description}
- **Items:** ${items.length}
- **Total Runs:** ${totalRuns}
- **Successful Runs:** ${successfulRuns}
- **Average Response Time:** ${averageMs}ms
- **Average Score:** ${averageScore.toFixed(2)}/5.0

## Quality Distribution

- **Ship (≥4.0):** ${statusCounts.ship} runs
- **Revise (3.0-3.9):** ${statusCounts.revise} runs  
- **Reject (<3.0):** ${statusCounts.reject} runs

## Provider Performance

${Object.entries(providerGroups).map(([key, providerRuns]) => {
  const [provider, model] = key.split('_');
  const providerScores = scores.filter(s => providerRuns.some(run => run.id === s.runId));
  const avgScore = providerScores.length > 0 
    ? providerScores.reduce((sum, s) => sum + s.weightedAverage, 0) / providerScores.length 
    : 0;
  const avgMs = providerRuns.length > 0 
    ? Math.round(providerRuns.reduce((sum, run) => sum + run.ms, 0) / providerRuns.length)
    : 0;
  
  return `### ${provider} (${model})
- **Runs:** ${providerRuns.length}
- **Success Rate:** ${Math.round((providerRuns.filter(r => r.ok).length / providerRuns.length) * 100)}%
- **Average Score:** ${avgScore.toFixed(2)}/5.0
- **Average Response Time:** ${avgMs}ms`;
}).join('\n\n')}

## Items Evaluated

${items.map((item, index) => {
  const itemRuns = runs.filter(run => run.itemId === item.id);
  const bestRun = itemRuns.reduce((best, run) => {
    const score = getScore(run.id);
    const bestScore = getScore(best.id);
    return (score?.weightedAverage || 0) > (bestScore?.weightedAverage || 0) ? run : best;
  }, itemRuns[0]);
  
  return `### ${index + 1}. ${item.idea.substring(0, 100)}${item.idea.length > 100 ? '...' : ''}
- **Persona:** ${item.persona || 'Not specified'}
- **Job:** ${item.job || 'Not specified'}
- **Runs:** ${itemRuns.length}
- **Best Run:** ${bestRun ? `${bestRun.provider} ${bestRun.model} (${getScore(bestRun.id)?.weightedAverage.toFixed(2) || 'N/A'}/5.0)` : 'None'}`;
}).join('\n\n')}

## Detailed Results

${runs.map((run, index) => {
  const item = items.find(item => item.id === run.itemId);
  const score = getScore(run.id);
  
  return `### Run ${index + 1}: ${item?.idea.substring(0, 50)}${(item?.idea.length || 0) > 50 ? '...' : ''}
- **Provider:** ${run.provider}
- **Model:** ${run.model}
- **Step:** ${run.step}
- **Parameters:** T=${run.params.temperature}, D=${run.params.depth}, F=${run.params.format}
- **Response Time:** ${run.ms}ms
- **Score:** ${score?.weightedAverage.toFixed(2) || 'Not scored'}/5.0
- **Status:** ${score?.status || 'Not evaluated'}
- **Created:** ${new Date(run.createdAt).toLocaleString()}`;
}).join('\n\n')}

---
*Generated by Business Builder Evaluation Harness*
`;
    
    const filename = `evaluation_summary_${set.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    downloadFile(markdown, filename, 'text/markdown');
    
    return true;
  } catch (error) {
    console.error('Failed to export evaluation summary:', error);
    return false;
  }
}

/**
 * Export all evaluation data as JSON
 */
export function exportAllEvaluations(): boolean {
  if (!isClient()) return false;
  
  try {
    const sets = listSets();
    const allData = {
      sets,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalSets: sets.length,
    };
    
    const filename = `all_evaluations_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(allData, null, 2), filename, 'application/json');
    
    return true;
  } catch (error) {
    console.error('Failed to export all evaluations:', error);
    return false;
  }
}

/**
 * Export comparison data for side-by-side analysis
 */
export function exportComparisonData(setId: string, runIds: string[]): boolean {
  if (!isClient()) return false;
  
  try {
    const set = getSet(setId);
    if (!set) return false;
    
    const runs = listRunsBySet(setId).filter(run => runIds.includes(run.id));
    const items = listItems(setId);
    const scores: EvaluationScore[] = [];
    
    runs.forEach(run => {
      const score = getScore(run.id);
      if (score) {
        scores.push(score);
      }
    });
    
    const comparisonData = {
      set: set.name,
      runs: runs.map(run => {
        const item = items.find(item => item.id === run.itemId);
        const score = getScore(run.id);
        
        return {
          runId: run.id,
          item: item?.idea,
          provider: run.provider,
          model: run.model,
          step: run.step,
          params: run.params,
          output: run.outputText,
          ms: run.ms,
          ok: run.ok,
          score: score?.weightedAverage,
          status: score?.status,
          createdAt: run.createdAt,
        };
      }),
      exportedAt: new Date().toISOString(),
    };
    
    const filename = `comparison_${set.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(comparisonData, null, 2), filename, 'application/json');
    
    return true;
  } catch (error) {
    console.error('Failed to export comparison data:', error);
    return false;
  }
}
