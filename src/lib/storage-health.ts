/**
 * Storage health monitoring and snapshot management
 */

export interface StorageSnapshot {
  id: string;
  projectId: string;
  name: string;
  data: Record<string, unknown>;
  createdAt: string;
  sizeBytes: number;
}

export interface StorageHealth {
  usageBytes: number;
  quotaBytes: number;
  usageRatio: number;
  status: 'ok' | 'warning' | 'critical';
}

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Estimate current localStorage usage in bytes
 */
export function estimateUsageBytes(): number {
  if (!isClient()) return 0;
  
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        totalBytes += key.length + value.length;
      }
    }
  }
  return totalBytes;
}

/**
 * Get estimated storage quota
 */
export function quotaBytes(): number {
  if (!isClient()) return 5 * 1024 * 1024; // 5MB default
  
  // Try to get actual quota if available
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    // This is async, so we'll use a conservative default for now
    return 5 * 1024 * 1024; // 5MB
  }
  
  return 5 * 1024 * 1024; // 5MB default
}

/**
 * Calculate usage ratio
 */
export function usageRatio(): number {
  const usage = estimateUsageBytes();
  const quota = quotaBytes();
  return quota > 0 ? usage / quota : 0;
}

/**
 * Get storage health status
 */
export function healthStatus(): 'ok' | 'warning' | 'critical' {
  const ratio = usageRatio();
  
  if (ratio >= 0.95) return 'critical';
  if (ratio >= 0.80) return 'warning';
  return 'ok';
}

/**
 * Get comprehensive storage health info
 */
export function getStorageHealth(): StorageHealth {
  const usageBytes = estimateUsageBytes();
  const quotaBytes = quotaBytes();
  const usageRatio = usageBytes / quotaBytes;
  const status = healthStatus();
  
  return {
    usageBytes,
    quotaBytes,
    usageRatio,
    status
  };
}

/**
 * Create a project snapshot
 */
export function createSnapshot(projectId: string, name: string): boolean {
  if (!isClient()) return false;
  
  try {
    const project = JSON.parse(localStorage.getItem('projects') || '[]')
      .find((p: Record<string, unknown>) => p.id === projectId);
    
    if (!project) return false;
    
    const snapshot: StorageSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      name,
      data: project,
      createdAt: new Date().toISOString(),
      sizeBytes: JSON.stringify(project).length
    };
    
    const snapshots = getSnapshots(projectId);
    snapshots.unshift(snapshot);
    
    // Keep only the last 5 snapshots per project
    const limitedSnapshots = snapshots.slice(0, 5);
    
    localStorage.setItem(`snapshots_${projectId}`, JSON.stringify(limitedSnapshots));
    return true;
  } catch (error) {
    console.error('Failed to create snapshot:', error);
    return false;
  }
}

/**
 * Get snapshots for a project
 */
export function getSnapshots(projectId: string): StorageSnapshot[] {
  if (!isClient()) return [];
  
  try {
    const data = localStorage.getItem(`snapshots_${projectId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Restore a project from snapshot
 */
export function restoreSnapshot(projectId: string, snapshotId: string): boolean {
  if (!isClient()) return false;
  
  try {
    const snapshots = getSnapshots(projectId);
    const snapshot = snapshots.find(s => s.id === snapshotId);
    
    if (!snapshot) return false;
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex((p: Record<string, unknown>) => p.id === projectId);
    
    if (projectIndex === -1) return false;
    
    // Restore the project data
    projects[projectIndex] = {
      ...snapshot.data,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('projects', JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Failed to restore snapshot:', error);
    return false;
  }
}

/**
 * Delete a snapshot
 */
export function deleteSnapshot(projectId: string, snapshotId: string): boolean {
  if (!isClient()) return false;
  
  try {
    const snapshots = getSnapshots(projectId);
    const filtered = snapshots.filter(s => s.id !== snapshotId);
    
    if (filtered.length === snapshots.length) return false;
    
    localStorage.setItem(`snapshots_${projectId}`, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete snapshot:', error);
    return false;
  }
}

/**
 * Export all data as JSON
 */
export function exportAllData(): string {
  if (!isClient()) return '{}';
  
  try {
    const data: Record<string, unknown> = {};
    
    // Export all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
    }
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    return '{}';
  }
}

/**
 * Clear non-essential data
 */
export function clearNonEssentials(): boolean {
  if (!isClient()) return false;
  
  try {
    const keysToKeep = ['projects', 'profile'];
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key) && !key.startsWith('quality_') && !key.startsWith('snapshots_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Failed to clear non-essentials:', error);
    return false;
  }
}
