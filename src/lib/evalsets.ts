/**
 * Evaluation sets management with CRUD operations
 * SSR-safe localStorage wrapper for evaluation sets and items
 */

import { createSetId, createItemId } from './hash';

export interface EvalSet {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvalItem {
  id: string;
  setId: string;
  idea: string;
  persona?: string;
  job?: string;
  notes?: string;
  createdAt: string;
}

const EVAL_SETS_KEY = 'business_builder_eval_sets';
const EVAL_ITEMS_KEY = 'business_builder_eval_items';

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get all evaluation sets
 */
function getSets(): EvalSet[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(EVAL_SETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse evaluation sets from localStorage', error);
    return [];
  }
}

/**
 * Save evaluation sets
 */
function saveSets(sets: EvalSet[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(EVAL_SETS_KEY, JSON.stringify(sets));
  } catch (error) {
    console.error('Failed to save evaluation sets to localStorage', error);
  }
}

/**
 * Get all evaluation items
 */
function getItems(): EvalItem[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(EVAL_ITEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse evaluation items from localStorage', error);
    return [];
  }
}

/**
 * Save evaluation items
 */
function saveItems(items: EvalItem[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(EVAL_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save evaluation items to localStorage', error);
  }
}

// Set management functions

/**
 * Create a new evaluation set
 */
export function createSet(name: string, description: string = ''): EvalSet {
  const sets = getSets();
  const now = new Date().toISOString();
  
  const newSet: EvalSet = {
    id: createSetId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
  };
  
  sets.push(newSet);
  saveSets(sets);
  
  return newSet;
}

/**
 * List all evaluation sets
 */
export function listSets(): EvalSet[] {
  return getSets().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Get a specific evaluation set
 */
export function getSet(id: string): EvalSet | undefined {
  return getSets().find(set => set.id === id);
}

/**
 * Rename an evaluation set
 */
export function renameSet(id: string, name: string): boolean {
  const sets = getSets();
  const setIndex = sets.findIndex(set => set.id === id);
  
  if (setIndex === -1) return false;
  
  sets[setIndex].name = name;
  sets[setIndex].updatedAt = new Date().toISOString();
  saveSets(sets);
  
  return true;
}

/**
 * Delete an evaluation set and all its items
 */
export function deleteSet(id: string): boolean {
  const sets = getSets();
  const items = getItems();
  
  const setIndex = sets.findIndex(set => set.id === id);
  if (setIndex === -1) return false;
  
  // Remove the set
  sets.splice(setIndex, 1);
  saveSets(sets);
  
  // Remove all items for this set
  const filteredItems = items.filter(item => item.setId !== id);
  saveItems(filteredItems);
  
  return true;
}

// Item management functions

/**
 * Add an item to an evaluation set
 */
export function addItem(setId: string, item: Omit<EvalItem, 'id' | 'setId' | 'createdAt'>): EvalItem {
  const items = getItems();
  const now = new Date().toISOString();
  
  const newItem: EvalItem = {
    id: createItemId(),
    setId,
    createdAt: now,
    ...item,
  };
  
  items.push(newItem);
  saveItems(items);
  
  return newItem;
}

/**
 * List items for a specific set
 */
export function listItems(setId: string): EvalItem[] {
  return getItems()
    .filter(item => item.setId === setId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Update an evaluation item
 */
export function updateItem(id: string, patch: Partial<Omit<EvalItem, 'id' | 'setId' | 'createdAt'>>): boolean {
  const items = getItems();
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) return false;
  
  items[itemIndex] = { ...items[itemIndex], ...patch };
  saveItems(items);
  
  return true;
}

/**
 * Delete an evaluation item
 */
export function deleteItem(id: string): boolean {
  const items = getItems();
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) return false;
  
  items.splice(itemIndex, 1);
  saveItems(items);
  
  return true;
}

// Import/Export functions

/**
 * Export a set as JSON
 */
export function exportSet(id: string): { set: EvalSet; items: EvalItem[] } | null {
  const set = getSet(id);
  if (!set) return null;
  
  const items = listItems(id);
  
  return { set, items };
}

/**
 * Import a set from JSON
 */
export function importSet(data: { set: EvalSet; items: EvalItem[] }): { success: boolean; setId?: string; error?: string } {
  try {
    // Validate the data structure
    if (!data.set || !data.set.name || !Array.isArray(data.items)) {
      return { success: false, error: 'Invalid data format' };
    }
    
    // Check if a set with this name already exists
    const existingSets = getSets();
    if (existingSets.some(set => set.name === data.set.name)) {
      return { success: false, error: 'A set with this name already exists' };
    }
    
    // Create the new set
    const newSet = createSet(data.set.name, data.set.description);
    
    // Import items
    const items = getItems();
    data.items.forEach(item => {
      const newItem: EvalItem = {
        id: createItemId(),
        setId: newSet.id,
        idea: item.idea,
        persona: item.persona,
        job: item.job,
        notes: item.notes,
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
    });
    saveItems(items);
    
    return { success: true, setId: newSet.id };
  } catch (error) {
    console.error('Failed to import set:', error);
    return { success: false, error: 'Import failed' };
  }
}

/**
 * Bulk create items from text input
 * Expected format: one idea per line, optional "persona: job" suffix
 */
export function bulkCreateItems(setId: string, textInput: string, defaultPersona?: string, defaultJob?: string): EvalItem[] {
  const lines = textInput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const items: EvalItem[] = [];
  
  lines.forEach(line => {
    // Parse line format: "idea" or "idea: persona: job"
    const parts = line.split(':');
    
    if (parts.length === 1) {
      // Just an idea
      items.push({
        id: createItemId(),
        setId,
        idea: parts[0].trim(),
        persona: defaultPersona,
        job: defaultJob,
        createdAt: new Date().toISOString(),
      });
    } else if (parts.length >= 3) {
      // Idea with persona and job
      items.push({
        id: createItemId(),
        setId,
        idea: parts[0].trim(),
        persona: parts[1].trim(),
        job: parts.slice(2).join(':').trim(),
        createdAt: new Date().toISOString(),
      });
    }
  });
  
  // Save all items
  const allItems = getItems();
  allItems.push(...items);
  saveItems(allItems);
  
  return items;
}
