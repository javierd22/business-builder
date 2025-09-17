'use client';

export interface ClarifyingQuestion {
  id: string;
  label: string;
  type: 'yesno' | 'select' | 'text' | 'number';
  options?: string[];
  priority: 'P0' | 'P1';
  notes?: string;
}

export interface ClarifyingAnswer {
  id: string;
  value: string;
  updatedAt: string;
}

const STORAGE_KEY = 'clarifications_answers';

// SSR-safe localStorage wrapper
function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function getStoredAnswers(): Record<string, ClarifyingAnswer> {
  const storage = getStorage();
  if (!storage) return {};
  
  try {
    const stored = storage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredAnswers(answers: Record<string, ClarifyingAnswer>) {
  const storage = getStorage();
  if (!storage) return;
  
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Silently fail if storage is full
  }
}

export function questions(): ClarifyingQuestion[] {
  return [
    {
      id: 'default_provider',
      label: 'Default AI Provider',
      type: 'select',
      options: ['anthropic', 'openai'],
      priority: 'P0',
      notes: 'Primary provider for AI operations'
    },
    {
      id: 'allowed_models_anthropic',
      label: 'Allowed Anthropic Models',
      type: 'text',
      priority: 'P0',
      notes: 'Comma-separated list of Anthropic model names'
    },
    {
      id: 'allowed_models_openai',
      label: 'Allowed OpenAI Models',
      type: 'text',
      priority: 'P0',
      notes: 'Comma-separated list of OpenAI model names'
    },
    {
      id: 'pricing_model',
      label: 'Pricing Model',
      type: 'select',
      options: ['free', 'freemium', 'subscription', 'per_project'],
      priority: 'P0',
      notes: 'How users will be charged for the service'
    },
    {
      id: 'collab_scope_v1',
      label: 'Collaboration Scope v1',
      type: 'select',
      options: ['none', 'export_import_only', 'share_link_readonly'],
      priority: 'P0',
      notes: 'Initial collaboration features for v1'
    },
    {
      id: 'required_exports_ga',
      label: 'Required Exports (GA)',
      type: 'text',
      priority: 'P1',
      notes: 'Export formats needed for general availability (e.g., PDF, Markdown, JSON, ZIP)'
    },
    {
      id: 'live_definition',
      label: 'Live App Definition',
      type: 'text',
      priority: 'P0',
      notes: 'Definition of what constitutes a "live app" for deployment'
    },
    {
      id: 'rate_limits_per_10m',
      label: 'Rate Limits (per 10 minutes)',
      type: 'number',
      priority: 'P1',
      notes: 'Default rate limit per route per 10 minutes'
    },
    {
      id: 'brand_voice_constraints',
      label: 'Brand Voice Constraints',
      type: 'text',
      priority: 'P1',
      notes: 'Words to prefer/avoid and tone guidelines'
    },
    {
      id: 'support_channel',
      label: 'Support Channel',
      type: 'text',
      priority: 'P1',
      notes: 'Where users report issues and SLA expectations'
    }
  ];
}

export function getAnswer(id: string): ClarifyingAnswer | undefined {
  const answers = getStoredAnswers();
  return answers[id];
}

export function setAnswer(id: string, value: string): void {
  const answers = getStoredAnswers();
  const question = questions().find(q => q.id === id);
  
  if (!question) return;
  
  // Validate and coerce value based on type
  let processedValue = value.trim();
  
  if (question.type === 'number') {
    const num = parseFloat(processedValue);
    if (isNaN(num)) return;
    processedValue = num.toString();
  } else if (question.type === 'yesno') {
    processedValue = processedValue.toLowerCase() === 'yes' ? 'yes' : 'no';
  } else if (question.type === 'select' && question.options) {
    if (!question.options.includes(processedValue)) return;
  }
  
  answers[id] = {
    id,
    value: processedValue,
    updatedAt: new Date().toISOString()
  };
  
  setStoredAnswers(answers);
}

export function allAnswers(): Record<string, ClarifyingAnswer> {
  return getStoredAnswers();
}

export function resetAnswers(): void {
  const storage = getStorage();
  if (!storage) return;
  
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
