/**
 * Success criteria tracking and mini insights
 */

// import { Project } from './storage';

export interface ProjectMilestone {
  projectId: string;
  milestone: 'idea_created' | 'prd_generated' | 'ux_generated' | 'deploy_initiated' | 'deploy_completed';
  timestamp: string;
  durationFromStart?: number; // milliseconds from idea creation
}

export interface ProjectInsights {
  projectId: string;
  idea: string;
  timeToPRD: number; // milliseconds
  timeToUX: number; // milliseconds
  timeToDeploy: number; // milliseconds
  completed: boolean;
  totalDuration: number; // milliseconds
  milestones: ProjectMilestone[];
}

export interface GlobalInsights {
  totalProjects: number;
  completedProjects: number;
  averageTimeToPRD: number; // milliseconds
  averageTimeToUX: number; // milliseconds
  averageTimeToDeploy: number; // milliseconds
  completionRate: number; // percentage
  medianTimeToPRD: number; // milliseconds
  medianTimeToUX: number; // milliseconds
  medianTimeToDeploy: number; // milliseconds
}

const MILESTONES_KEY = 'business_builder_milestones';
const INSIGHTS_KEY = 'business_builder_insights';

/**
 * Check if we're running in the browser
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get all milestones from localStorage
 */
function getMilestones(): ProjectMilestone[] {
  if (!isClient()) return [];

  try {
    const data = localStorage.getItem(MILESTONES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Failed to parse milestones:', error);
    return [];
  }
}

/**
 * Save milestones to localStorage
 */
function saveMilestones(milestones: ProjectMilestone[]): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
  } catch (error) {
    console.warn('Failed to save milestones:', error);
  }
}

/**
 * Record a project milestone
 */
export function recordMilestone(
  projectId: string,
  milestone: ProjectMilestone['milestone']
): void {
  if (!isClient()) return;

  const milestones = getMilestones();
  const now = new Date().toISOString();
  
  // Find the idea creation milestone for this project
  const ideaMilestone = milestones.find(
    m => m.projectId === projectId && m.milestone === 'idea_created'
  );
  
  const durationFromStart = ideaMilestone 
    ? new Date(now).getTime() - new Date(ideaMilestone.timestamp).getTime()
    : undefined;

  const newMilestone: ProjectMilestone = {
    projectId,
    milestone,
    timestamp: now,
    durationFromStart,
  };

  // Remove any existing milestone of the same type for this project
  const filteredMilestones = milestones.filter(
    m => !(m.projectId === projectId && m.milestone === milestone)
  );

  filteredMilestones.push(newMilestone);
  saveMilestones(filteredMilestones);
}

/**
 * Get insights for a specific project
 */
export function getProjectInsights(projectId: string, idea: string): ProjectInsights | null {
  if (!isClient()) return null;

  const milestones = getMilestones().filter(m => m.projectId === projectId);
  
  if (milestones.length === 0) return null;

  const ideaMilestone = milestones.find(m => m.milestone === 'idea_created');
  const prdMilestone = milestones.find(m => m.milestone === 'prd_generated');
  const uxMilestone = milestones.find(m => m.milestone === 'ux_generated');
  const deployMilestone = milestones.find(m => m.milestone === 'deploy_completed');

  if (!ideaMilestone) return null;

  const timeToPRD = prdMilestone?.durationFromStart || 0;
  const timeToUX = uxMilestone?.durationFromStart || 0;
  const timeToDeploy = deployMilestone?.durationFromStart || 0;
  
  const completed = !!deployMilestone;
  const totalDuration = completed ? timeToDeploy : (uxMilestone?.durationFromStart || prdMilestone?.durationFromStart || 0);

  return {
    projectId,
    idea,
    timeToPRD,
    timeToUX,
    timeToDeploy,
    completed,
    totalDuration,
    milestones: milestones.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  };
}

/**
 * Get global insights across all projects
 */
export function getGlobalInsights(): GlobalInsights {
  if (!isClient()) {
    return {
      totalProjects: 0,
      completedProjects: 0,
      averageTimeToPRD: 0,
      averageTimeToUX: 0,
      averageTimeToDeploy: 0,
      completionRate: 0,
      medianTimeToPRD: 0,
      medianTimeToUX: 0,
      medianTimeToDeploy: 0,
    };
  }

  const milestones = getMilestones();
  const projectIds = [...new Set(milestones.map(m => m.projectId))];
  
  if (projectIds.length === 0) {
    return {
      totalProjects: 0,
      completedProjects: 0,
      averageTimeToPRD: 0,
      averageTimeToUX: 0,
      averageTimeToDeploy: 0,
      completionRate: 0,
      medianTimeToPRD: 0,
      medianTimeToUX: 0,
      medianTimeToDeploy: 0,
    };
  }

  const projectInsights = projectIds
    .map(id => {
      const projectMilestones = milestones.filter(m => m.projectId === id);
      const ideaMilestone = projectMilestones.find(m => m.milestone === 'idea_created');
      return ideaMilestone ? getProjectInsights(id, 'Unknown') : null;
    })
    .filter((insights): insights is ProjectInsights => insights !== null);

  const completedProjects = projectInsights.filter(p => p.completed).length;
  
  const prdTimes = projectInsights
    .filter(p => p.timeToPRD > 0)
    .map(p => p.timeToPRD);
  
  const uxTimes = projectInsights
    .filter(p => p.timeToUX > 0)
    .map(p => p.timeToUX);
  
  const deployTimes = projectInsights
    .filter(p => p.timeToDeploy > 0)
    .map(p => p.timeToDeploy);

  const averageTimeToPRD = prdTimes.length > 0 ? prdTimes.reduce((a, b) => a + b, 0) / prdTimes.length : 0;
  const averageTimeToUX = uxTimes.length > 0 ? uxTimes.reduce((a, b) => a + b, 0) / uxTimes.length : 0;
  const averageTimeToDeploy = deployTimes.length > 0 ? deployTimes.reduce((a, b) => a + b, 0) / deployTimes.length : 0;

  const medianTimeToPRD = prdTimes.length > 0 ? getMedian(prdTimes) : 0;
  const medianTimeToUX = uxTimes.length > 0 ? getMedian(uxTimes) : 0;
  const medianTimeToDeploy = deployTimes.length > 0 ? getMedian(deployTimes) : 0;

  return {
    totalProjects: projectIds.length,
    completedProjects,
    averageTimeToPRD,
    averageTimeToUX,
    averageTimeToDeploy,
    completionRate: projectIds.length > 0 ? (completedProjects / projectIds.length) * 100 : 0,
    medianTimeToPRD,
    medianTimeToUX,
    medianTimeToDeploy,
  };
}

/**
 * Calculate median value from array of numbers
 */
function getMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}

/**
 * Get recent project insights (last 10 projects)
 */
export function getRecentProjectInsights(): ProjectInsights[] {
  if (!isClient()) return [];

  const milestones = getMilestones();
  const projectIds = [...new Set(milestones.map(m => m.projectId))];
  
  return projectIds
    .map(id => {
      const projectMilestones = milestones.filter(m => m.projectId === id);
      const ideaMilestone = projectMilestones.find(m => m.milestone === 'idea_created');
      return ideaMilestone ? getProjectInsights(id, 'Unknown') : null;
    })
    .filter((insights): insights is ProjectInsights => insights !== null)
    .sort((a, b) => {
      const aTime = new Date(a.milestones[0]?.timestamp || 0).getTime();
      const bTime = new Date(b.milestones[0]?.timestamp || 0).getTime();
      return bTime - aTime; // Most recent first
    })
    .slice(0, 10);
}

/**
 * Clear all insights data
 */
export function clearInsightsData(): void {
  if (!isClient()) return;

  localStorage.removeItem(MILESTONES_KEY);
  localStorage.removeItem(INSIGHTS_KEY);
}
