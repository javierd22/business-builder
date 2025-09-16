/**
 * Quality evaluation rubric and scoring system
 */

export interface QualityScore {
  clarity: number; // 1-5: How clear and understandable is the content?
  completeness: number; // 1-5: How comprehensive and thorough is the content?
  feasibility: number; // 1-5: How realistic and achievable are the recommendations?
  riskAwareness: number; // 1-5: How well are risks identified and addressed?
  actionability: number; // 1-5: How actionable and specific are the next steps?
}

export interface QualityFeedback {
  id: string;
  projectId: string;
  artifactType: 'prd' | 'ux';
  artifactId: string; // ID of the specific PRD/UX version
  scores: QualityScore;
  feedback: string;
  createdAt: string;
}

export interface QualitySummary {
  averageScore: number;
  totalEvaluations: number;
  scores: QualityScore;
  recentFeedback: string[];
}

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get quality feedback for a project
 */
export function getQualityFeedback(projectId: string): QualityFeedback[] {
  if (!isClient()) return [];
  
  try {
    const data = localStorage.getItem(`quality_${projectId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save quality feedback
 */
export function saveQualityFeedback(feedback: Omit<QualityFeedback, 'id' | 'createdAt'>): void {
  if (!isClient()) return;
  
  try {
    const newFeedback: QualityFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    const existing = getQualityFeedback(feedback.projectId);
    const updated = [newFeedback, ...existing];
    
    localStorage.setItem(`quality_${feedback.projectId}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save quality feedback:', error);
  }
}

/**
 * Get quality summary for a project
 */
export function getQualitySummary(projectId: string, artifactType?: 'prd' | 'ux'): QualitySummary {
  const allFeedback = getQualityFeedback(projectId);
  const filteredFeedback = artifactType 
    ? allFeedback.filter(f => f.artifactType === artifactType)
    : allFeedback;
  
  if (filteredFeedback.length === 0) {
    return {
      averageScore: 0,
      totalEvaluations: 0,
      scores: { clarity: 0, completeness: 0, feasibility: 0, riskAwareness: 0, actionability: 0 },
      recentFeedback: []
    };
  }
  
  const totalScores = filteredFeedback.reduce((acc, feedback) => {
    acc.clarity += feedback.scores.clarity;
    acc.completeness += feedback.scores.completeness;
    acc.feasibility += feedback.scores.feasibility;
    acc.riskAwareness += feedback.scores.riskAwareness;
    acc.actionability += feedback.scores.actionability;
    return acc;
  }, { clarity: 0, completeness: 0, feasibility: 0, riskAwareness: 0, actionability: 0 });
  
  const count = filteredFeedback.length;
  const averageScores: QualityScore = {
    clarity: totalScores.clarity / count,
    completeness: totalScores.completeness / count,
    feasibility: totalScores.feasibility / count,
    riskAwareness: totalScores.riskAwareness / count,
    actionability: totalScores.actionability / count
  };
  
  const averageScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0) / 5;
  
  return {
    averageScore: Math.round(averageScore * 10) / 10,
    totalEvaluations: count,
    scores: averageScores,
    recentFeedback: filteredFeedback
      .slice(0, 3)
      .map(f => f.feedback)
      .filter(f => f.trim().length > 0)
  };
}

/**
 * Get quality criteria descriptions
 */
export function getQualityCriteria(): Record<keyof QualityScore, { label: string; description: string }> {
  return {
    clarity: {
      label: 'Clarity',
      description: 'How clear and understandable is the content?'
    },
    completeness: {
      label: 'Completeness',
      description: 'How comprehensive and thorough is the content?'
    },
    feasibility: {
      label: 'Feasibility',
      description: 'How realistic and achievable are the recommendations?'
    },
    riskAwareness: {
      label: 'Risk Awareness',
      description: 'How well are risks identified and addressed?'
    },
    actionability: {
      label: 'Actionability',
      description: 'How actionable and specific are the next steps?'
    }
  };
}

/**
 * Calculate quality grade from average score
 */
export function getQualityGrade(averageScore: number): { grade: string; color: string } {
  if (averageScore >= 4.5) return { grade: 'Excellent', color: 'text-green-600' };
  if (averageScore >= 4.0) return { grade: 'Good', color: 'text-green-500' };
  if (averageScore >= 3.5) return { grade: 'Fair', color: 'text-yellow-500' };
  if (averageScore >= 3.0) return { grade: 'Needs Improvement', color: 'text-orange-500' };
  return { grade: 'Poor', color: 'text-red-500' };
}
