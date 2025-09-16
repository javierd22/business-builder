/**
 * Assumptions tracking for local-only validation
 * Stores research assumptions with status, evidence, and priority
 */

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export type AssumptionPriority = 'P0' | 'P1' | 'P2';
export type AssumptionStatus = 'unvalidated' | 'validated' | 'invalidated';

export interface Assumption {
  id: string;
  priority: AssumptionPriority;
  status: AssumptionStatus;
  evidence: string;
  updatedAt: string;
}

export type AssumptionId = 
  | 'local_only_ok'
  | 'first_draft_value'
  | 'deploy_link_counts_as_live'
  | 'pricing_wtp'
  | 'persona_jtbd_helpful'
  | 'exports_needed'
  | 'collaboration_needed';

const ASSUMPTIONS_KEY = 'business-builder-assumptions';

// Default assumptions with priorities
const DEFAULT_ASSUMPTIONS: Assumption[] = [
  {
    id: 'local_only_ok',
    priority: 'P0',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'first_draft_value',
    priority: 'P0',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'deploy_link_counts_as_live',
    priority: 'P0',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pricing_wtp',
    priority: 'P1',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'persona_jtbd_helpful',
    priority: 'P1',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'exports_needed',
    priority: 'P2',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'collaboration_needed',
    priority: 'P2',
    status: 'unvalidated',
    evidence: '',
    updatedAt: new Date().toISOString()
  }
];

export function listAssumptions(): Assumption[] {
  if (!isClient()) return DEFAULT_ASSUMPTIONS;
  
  try {
    const stored = localStorage.getItem(ASSUMPTIONS_KEY);
    if (!stored) {
      localStorage.setItem(ASSUMPTIONS_KEY, JSON.stringify(DEFAULT_ASSUMPTIONS));
      return DEFAULT_ASSUMPTIONS;
    }
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(ASSUMPTIONS_KEY, JSON.stringify(DEFAULT_ASSUMPTIONS));
      return DEFAULT_ASSUMPTIONS;
    }
    
    // Ensure all default assumptions exist, add missing ones
    const existing = new Set(parsed.map((a: Assumption) => a.id));
    const complete = [...parsed];
    
    for (const defaultAssumption of DEFAULT_ASSUMPTIONS) {
      if (!existing.has(defaultAssumption.id)) {
        complete.push(defaultAssumption);
      }
    }
    
    return complete;
  } catch (error) {
    console.warn('Failed to load assumptions:', error);
    return DEFAULT_ASSUMPTIONS;
  }
}

export function getAssumption(id: AssumptionId): Assumption | null {
  if (!isClient()) return null;
  
  const assumptions = listAssumptions();
  return assumptions.find(a => a.id === id) || null;
}

export function upsertAssumption(partial: Partial<Assumption> & { id: AssumptionId }): void {
  if (!isClient()) return;
  
  try {
    const assumptions = listAssumptions();
    const index = assumptions.findIndex(a => a.id === partial.id);
    
    if (index >= 0) {
      // Update existing
      assumptions[index] = {
        ...assumptions[index],
        ...partial,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new (find default for priority)
      const defaultAssumption = DEFAULT_ASSUMPTIONS.find(a => a.id === partial.id);
      assumptions.push({
        id: partial.id,
        priority: partial.priority || defaultAssumption?.priority || 'P2',
        status: partial.status || 'unvalidated',
        evidence: partial.evidence || '',
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(ASSUMPTIONS_KEY, JSON.stringify(assumptions));
  } catch (error) {
    console.warn('Failed to upsert assumption:', error);
  }
}

export function setStatus(id: AssumptionId, status: AssumptionStatus, evidence?: string): void {
  if (!isClient()) return;
  
  const existing = getAssumption(id);
  if (!existing) return;
  
  upsertAssumption({
    id,
    status,
    evidence: evidence ? 
      (existing.evidence ? `${existing.evidence}\n\n${evidence}` : evidence) : 
      existing.evidence
  });
}

export function resetAllAssumptions(): void {
  if (!isClient()) return;
  
  try {
    localStorage.setItem(ASSUMPTIONS_KEY, JSON.stringify(DEFAULT_ASSUMPTIONS));
  } catch (error) {
    console.warn('Failed to reset assumptions:', error);
  }
}

export function getAssumptionTitle(id: AssumptionId): string {
  const titles: Record<AssumptionId, string> = {
    local_only_ok: 'Users accept localStorage-only storage',
    first_draft_value: 'LLM first draft provides value',
    deploy_link_counts_as_live: 'Deploy link satisfies "going live"',
    pricing_wtp: 'Willingness to pay exists at target ranges',
    persona_jtbd_helpful: 'Persona/JTBD personalization improves outcomes',
    exports_needed: 'Exports are required for handoff',
    collaboration_needed: 'Collaboration scope needed despite local-only'
  };
  
  return titles[id] || id;
}
