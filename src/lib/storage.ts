/**
 * SSR-safe localStorage layer for project management
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
  llm?: {
    plan?: {
      provider: string;
      model: string;
      durationMs: number;
      tokensUsed?: number;
      costEstimate?: number;
    };
    ux?: {
      provider: string;
      model: string;
      durationMs: number;
      tokensUsed?: number;
      costEstimate?: number;
    };
  };
}

export interface Profile {
  persona: string;
  job: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Check if we're running in the browser
 */
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Generate a unique ID for projects
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Safely parse JSON with fallback
 */
function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to parse JSON from localStorage");
    }
    return fallback;
  }
}

/**
 * Get all projects from localStorage
 */
export function getProjects(): Project[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem("projects");
    if (!stored) return [];
    
    return safeJsonParse<Project[]>(stored, []);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Error reading projects from localStorage:", error);
    }
    return [];
  }
}

/**
 * Get a specific project by ID
 */
export function getProject(id: string): Project | null {
  if (!isClient() || !id) return null;
  
  const projects = getProjects();
  return projects.find(project => project.id === id) || null;
}

/**
 * Save projects array to localStorage
 */
export function saveProjects(projects: Project[]): void {
  if (!isClient()) return;
  
  try {
    localStorage.setItem("projects", JSON.stringify(projects));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Error saving projects to localStorage:", error);
    }
  }
}

/**
 * Add a new project
 */
export function addProject(data: Pick<Project, "idea">): Project {
  const now = new Date().toISOString();
  const newProject: Project = {
    id: generateId(),
    idea: data.idea,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  
  const projects = getProjects();
  projects.unshift(newProject);
  saveProjects(projects);
  
  return newProject;
}

/**
 * Update an existing project
 */
export function updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt">>): Project | null {
  if (!isClient() || !id) return null;
  
  const projects = getProjects();
  const index = projects.findIndex(project => project.id === id);
  
  if (index === -1) return null;
  
  const updatedProject: Project = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  projects[index] = updatedProject;
  saveProjects(projects);
  
  return updatedProject;
}

/**
 * Delete a project
 */
export function deleteProject(id: string): boolean {
  if (!isClient() || !id) return false;
  
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false; // Project not found
  }
  
  saveProjects(filteredProjects);
  return true;
}

// ===== PROFILE STORAGE FUNCTIONS =====

/**
 * Get user profile from localStorage
 */
export function getProfile(): Profile | null {
  if (!isClient()) return null;
  
  try {
    const profileData = localStorage.getItem('profile');
    if (!profileData) return null;
    
    const profile = JSON.parse(profileData) as Profile;
    
    // Validate required fields
    if (!profile.persona || !profile.job || !profile.createdAt || !profile.updatedAt) {
      console.warn('Invalid profile data, clearing...');
      localStorage.removeItem('profile');
      return null;
    }
    
    return profile;
  } catch (error) {
    console.warn('Failed to parse profile from localStorage:', error);
    localStorage.removeItem('profile');
    return null;
  }
}

/**
 * Save user profile to localStorage
 */
export function saveProfile(profile: Omit<Profile, 'createdAt' | 'updatedAt'>): Profile {
  if (!isClient()) {
    throw new Error('Profile can only be saved on the client side');
  }
  
  const now = new Date().toISOString();
  const existingProfile = getProfile();
  
  const newProfile: Profile = {
    ...profile,
    createdAt: existingProfile?.createdAt || now,
    updatedAt: now,
  };
  
  try {
    localStorage.setItem('profile', JSON.stringify(newProfile));
    return newProfile;
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
    throw new Error('Failed to save profile');
  }
}

/**
 * Update user profile
 */
export function updateProfile(updates: Partial<Omit<Profile, 'createdAt' | 'updatedAt'>>): Profile | null {
  if (!isClient()) return null;
  
  const existingProfile = getProfile();
  if (!existingProfile) {
    throw new Error('No existing profile to update');
  }
  
  const updatedProfile = {
    ...existingProfile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return saveProfile(updatedProfile);
}

/**
 * Clear user profile
 */
export function clearProfile(): boolean {
  if (!isClient()) return false;
  
  try {
    localStorage.removeItem('profile');
    return true;
  } catch (error) {
    console.error('Failed to clear profile from localStorage:', error);
    return false;
  }
}

/**
 * Clear all projects (for development/testing)
 */
export function clearProjects(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem("projects");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Error clearing projects from localStorage:", error);
    }
  }
}