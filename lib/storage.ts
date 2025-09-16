/**
 * Type-safe localStorage wrapper for project management
 * All functions are SSR-safe and handle JSON parsing errors gracefully
 */

export interface Project {
  id: string;
  idea: string;
  prd?: string;
  ux?: string;
  deploymentLink?: string;
  status: "draft" | "planning" | "ux_design" | "deploying" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "projects";

/**
 * Check if we're in a browser environment (SSR-safe)
 */
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Generate a unique ID for new projects
 */
function generateId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safely parse JSON with fallback
 */
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON from localStorage:", error);
    return fallback;
  }
}

/**
 * Get all projects from localStorage
 * Returns empty array if not in browser or if parsing fails
 */
export function getProjects(): Project[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return safeJsonParse<Project[]>(stored, []);
  } catch (error) {
    console.error("Failed to get projects from localStorage:", error);
    return [];
  }
}

/**
 * Save projects array to localStorage
 * Safely handles SSR and storage errors
 */
export function saveProjects(projects: Project[]): void {
  if (!isClient()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Failed to save projects to localStorage:", error);
  }
}

/**
 * Add a new project with auto-generated ID and default status
 * Returns the created project
 */
export function addProject(project: Omit<Project, "id" | "status" | "createdAt" | "updatedAt">): Project {
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: generateId(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  
  const projects = getProjects();
  projects.push(newProject);
  saveProjects(projects);
  
  return newProject;
}

/**
 * Update an existing project by ID with partial data
 * Returns true if project was found and updated
 */
export function updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt">>): boolean {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    console.warn(`Project with id ${id} not found`);
    return false;
  }
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveProjects(projects);
  return true;
}

/**
 * Delete a project by ID
 * Returns true if project was found and deleted
 */
export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    console.warn(`Project with id ${id} not found`);
    return false;
  }
  
  projects.splice(index, 1);
  saveProjects(projects);
  return true;
}

/**
 * Get a single project by ID
 * Returns undefined if not found
 */
export function getProject(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find(p => p.id === id);
}

/**
 * Clear all projects (useful for testing/reset)
 */
export function clearProjects(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear projects from localStorage:", error);
  }
}
