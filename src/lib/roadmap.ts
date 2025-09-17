'use client';

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  files: string[];
  priority: 'P0' | 'P1';
  status: 'backlog' | 'in_progress' | 'done';
  blockedBy?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'roadmap_tasks';

// SSR-safe localStorage wrapper
function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function getStoredTasks(): RoadmapTask[] {
  const storage = getStorage();
  if (!storage) return [];
  
  try {
    const stored = storage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredTasks(tasks: RoadmapTask[]) {
  const storage = getStorage();
  if (!storage) return;
  
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Silently fail if storage is full
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function seedIfEmpty(tasks: RoadmapTask[]): void {
  const existing = getStoredTasks();
  if (existing.length > 0) return;
  
  const now = new Date().toISOString();
  const seededTasks = tasks.map(task => ({
    ...task,
    id: task.id || generateId(),
    createdAt: now,
    updatedAt: now
  }));
  
  setStoredTasks(seededTasks);
}

export function listTasks(): RoadmapTask[] {
  return getStoredTasks();
}

export function getTask(id: string): RoadmapTask | undefined {
  const tasks = getStoredTasks();
  return tasks.find(task => task.id === id);
}

export function upsertTask(task: Omit<RoadmapTask, 'createdAt' | 'updatedAt'>): RoadmapTask {
  const tasks = getStoredTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  const now = new Date().toISOString();
  
  const updatedTask: RoadmapTask = {
    ...task,
    createdAt: existingIndex >= 0 ? tasks[existingIndex].createdAt : now,
    updatedAt: now
  };
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = updatedTask;
  } else {
    tasks.push(updatedTask);
  }
  
  setStoredTasks(tasks);
  return updatedTask;
}

export function setStatus(id: string, status: RoadmapTask['status']): void {
  const tasks = getStoredTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex >= 0) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    setStoredTasks(tasks);
  }
}

export function deleteTask(id: string): void {
  const tasks = getStoredTasks();
  const filtered = tasks.filter(t => t.id !== id);
  setStoredTasks(filtered);
}

export function reseed(): void {
  const storage = getStorage();
  if (!storage) return;
  
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
  
  // Re-seed with default tasks
  const defaultTasks = getDefaultTasks();
  const now = new Date().toISOString();
  const tasksWithTimestamps = defaultTasks.map(task => ({
    ...task,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  }));
  seedIfEmpty(tasksWithTimestamps);
}

export function exportJSON(): string {
  const tasks = getStoredTasks();
  return JSON.stringify(tasks, null, 2);
}

export function importJSON(json: string): { success: boolean; errors: string[] } {
  try {
    const parsed = JSON.parse(json);
    
    if (!Array.isArray(parsed)) {
      return { success: false, errors: ['Data must be an array of tasks'] };
    }
    
    const errors: string[] = [];
    const tasks: RoadmapTask[] = [];
    
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      const errorPrefix = `Task ${i + 1}: `;
      
      if (!item.id || typeof item.id !== 'string') {
        errors.push(`${errorPrefix}Missing or invalid id`);
      }
      if (!item.title || typeof item.title !== 'string') {
        errors.push(`${errorPrefix}Missing or invalid title`);
      }
      if (!item.description || typeof item.description !== 'string') {
        errors.push(`${errorPrefix}Missing or invalid description`);
      }
      if (!Array.isArray(item.files)) {
        errors.push(`${errorPrefix}Files must be an array`);
      }
      if (!['P0', 'P1'].includes(item.priority)) {
        errors.push(`${errorPrefix}Priority must be P0 or P1`);
      }
      if (!['backlog', 'in_progress', 'done'].includes(item.status)) {
        errors.push(`${errorPrefix}Status must be backlog, in_progress, or done`);
      }
      if (!item.createdAt || typeof item.createdAt !== 'string') {
        errors.push(`${errorPrefix}Missing or invalid createdAt`);
      }
      if (!item.updatedAt || typeof item.updatedAt !== 'string') {
        errors.push(`${errorPrefix}Missing or invalid updatedAt`);
      }
      
      if (errors.length === 0 || errors.every(e => !e.startsWith(errorPrefix))) {
        tasks.push(item as RoadmapTask);
      }
    }
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    setStoredTasks(tasks);
    return { success: true, errors: [] };
  } catch (error) {
    return { 
      success: false, 
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`] 
    };
  }
}

function getDefaultTasks(): Omit<RoadmapTask, 'id' | 'createdAt' | 'updatedAt'>[] {
  return [
    {
      title: 'Provider & Model Picker UI',
      description: 'Settings page to choose provider/model (read-only if key missing)',
      files: ['src/app/settings/provider/page.tsx', 'src/lib/env.ts'],
      priority: 'P0',
      status: 'backlog'
    },
    {
      title: 'Prompt Registry v2 (versioned & labeled)',
      description: 'Versioned prompt profiles with descriptions & change notes',
      files: ['src/lib/prompt-profiles.ts', 'docs/PROMPTS_CHANGELOG.md'],
      priority: 'P0',
      status: 'backlog'
    },
    {
      title: 'Idea Templates by Vertical',
      description: 'Add vertical library + chips',
      files: ['src/lib/jtbd-templates.ts', 'src/app/idea/page.tsx'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'Undo/Redo for PRD Editor',
      description: 'Local history capped at N',
      files: ['src/app/plan/review/[projectId]/page.tsx'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'Keyboard Shortcuts',
      description: '? help modal',
      files: ['src/app/_components/ShortcutsHelp.tsx', 'page integrations'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'Archive & Tags for Projects',
      description: 'Filters + tag editor',
      files: ['src/lib/storage.ts', 'src/app/dashboard/page.tsx (or /)'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'SEO & Social Previews',
      description: 'Metadata, OpenGraph images',
      files: ['src/app/layout.tsx', 'src/app/opengraph-image.tsx'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'PWA (Local-First Offline)',
      description: 'Manifest + minimal service worker (no network caching of APIs)',
      files: ['src/app/manifest.webmanifest', 'public/icons/*', 'src/sw.ts (if applicable)'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'Tour / First-Run Coachmarks',
      description: 'Subtle inline tips across the 4 steps',
      files: ['src/app/_components/Tour.tsx', 'page integrations'],
      priority: 'P1',
      status: 'backlog'
    },
    {
      title: 'Deploy Experience Polish',
      description: 'Success page variants, copy, and link guard',
      files: ['src/app/deploy/[projectId]/page.tsx'],
      priority: 'P0',
      status: 'backlog'
    }
  ];
}
