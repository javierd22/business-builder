/**
 * Local-first A/B testing and experimentation system
 */

export interface Experiment {
  name: string;
  variants: string[];
  weights?: number[];
}

export interface ExperimentAssignment {
  experiment: string;
  variant: string;
  assignedAt: string;
}

// Define available experiments
const EXPERIMENTS: Record<string, Experiment> = {
  hero_copy_v1: {
    name: 'Hero Copy Test',
    variants: ['A', 'B'],
    weights: [0.5, 0.5]
  },
  pricing_cta_label_v1: {
    name: 'Pricing CTA Label Test',
    variants: ['A', 'B'],
    weights: [0.5, 0.5]
  }
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getUserId(): string {
  if (!isClient()) return 'server';
  
  try {
    let userId = localStorage.getItem('user-id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user-id', userId);
    }
    return userId;
  } catch (error) {
    console.warn('Failed to get user ID:', error);
    return 'unknown';
  }
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function getVariantFromHash(experiment: Experiment, seed: string): string {
  const hash = simpleHash(seed);
  const normalizedHash = hash / 0x7fffffff; // Normalize to 0-1
  
  let cumulativeWeight = 0;
  const weights = experiment.weights || experiment.variants.map(() => 1 / experiment.variants.length);
  
  for (let i = 0; i < experiment.variants.length; i++) {
    cumulativeWeight += weights[i];
    if (normalizedHash <= cumulativeWeight) {
      return experiment.variants[i];
    }
  }
  
  // Fallback to first variant
  return experiment.variants[0];
}

/**
 * Get variant for a specific experiment
 */
export function getVariant(experimentName: string): string {
  if (!isClient()) return 'A';
  
  try {
    const experiment = EXPERIMENTS[experimentName];
    if (!experiment) {
      console.warn(`Experiment ${experimentName} not found`);
      return 'A';
    }

    // Check if already assigned
    const assignments = getAssignments();
    const existing = assignments.find(a => a.experiment === experimentName);
    if (existing) {
      return existing.variant;
    }

    // Assign new variant
    const userId = getUserId();
    const seed = `${userId}_${experimentName}`;
    const variant = getVariantFromHash(experiment, seed);
    
    // Store assignment
    const assignment: ExperimentAssignment = {
      experiment: experimentName,
      variant,
      assignedAt: new Date().toISOString()
    };
    
    const updatedAssignments = [...assignments, assignment];
    localStorage.setItem('experiments', JSON.stringify(updatedAssignments));
    
    return variant;
  } catch (error) {
    console.warn(`Failed to get variant for ${experimentName}:`, error);
    return 'A';
  }
}

/**
 * Get all experiment assignments
 */
export function getAssignments(): ExperimentAssignment[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem('experiments');
    if (!stored) return [];
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to get experiment assignments:', error);
    return [];
  }
}

/**
 * Assign all experiments at once
 */
export function assignAll(): ExperimentAssignment[] {
  if (!isClient()) return [];
  
  try {
    const assignments: ExperimentAssignment[] = [];
    const userId = getUserId();
    
    for (const [name, experiment] of Object.entries(EXPERIMENTS)) {
      const seed = `${userId}_${name}`;
      const variant = getVariantFromHash(experiment, seed);
      
      assignments.push({
        experiment: name,
        variant,
        assignedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('experiments', JSON.stringify(assignments));
    return assignments;
  } catch (error) {
    console.warn('Failed to assign all experiments:', error);
    return [];
  }
}

/**
 * List all available experiments
 */
export function listExperiments(): Experiment[] {
  return Object.values(EXPERIMENTS);
}

/**
 * Get experiment statistics
 */
export function getExperimentStats(): Record<string, Record<string, number>> {
  if (!isClient()) return {};
  
  try {
    const assignments = getAssignments();
    const stats: Record<string, Record<string, number>> = {};
    
    for (const assignment of assignments) {
      if (!stats[assignment.experiment]) {
        stats[assignment.experiment] = {};
      }
      
      if (!stats[assignment.experiment][assignment.variant]) {
        stats[assignment.experiment][assignment.variant] = 0;
      }
      
      stats[assignment.experiment][assignment.variant]++;
    }
    
    return stats;
  } catch (error) {
    console.warn('Failed to get experiment stats:', error);
    return {};
  }
}

/**
 * Clear all experiment assignments
 */
export function clearAssignments(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem('experiments');
  } catch (error) {
    console.warn('Failed to clear experiment assignments:', error);
  }
}
