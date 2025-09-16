/**
 * Central environment configuration with validation and server-only access
 */

export type LLMProvider = 'anthropic' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  anthropicApiKey: string;
  openaiApiKey: string;
  anthropicModel: string;
  openaiModel: string;
  timeoutMs: number;
  mockMode: boolean;
  showBuildInfo: boolean;
}

/**
 * Validate and parse environment variables
 */
function parseEnvConfig(): LLMConfig {
  const provider = process.env.LLM_PROVIDER as LLMProvider;
  
  // Default to mock mode if no provider is set
  if (!provider || !['anthropic', 'openai'].includes(provider)) {
    console.warn('LLM_PROVIDER not set or invalid, defaulting to mock mode');
    return {
      provider: 'anthropic',
      anthropicApiKey: '',
      openaiApiKey: '',
      anthropicModel: 'claude-3-5-sonnet-latest',
      openaiModel: 'gpt-4o-mini',
      timeoutMs: 60000,
      mockMode: true,
      showBuildInfo: true,
    };
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
  const openaiApiKey = process.env.OPENAI_API_KEY || '';
  
  // If no API keys are provided, default to mock mode
  if ((provider === 'anthropic' && !anthropicApiKey) || (provider === 'openai' && !openaiApiKey)) {
    console.warn(`No API key provided for ${provider}, defaulting to mock mode`);
    return {
      provider,
      anthropicApiKey: '',
      openaiApiKey: '',
      anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      timeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '60000', 10),
      mockMode: true,
      showBuildInfo: process.env.NEXT_PUBLIC_SHOW_BUILD_INFO?.toLowerCase() === 'true',
    };
  }

  return {
    provider,
    anthropicApiKey,
    openaiApiKey,
    anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    timeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '60000', 10),
    mockMode: process.env.NEXT_PUBLIC_MOCK_AI?.toLowerCase() === 'true',
    showBuildInfo: process.env.NEXT_PUBLIC_SHOW_BUILD_INFO?.toLowerCase() === 'true',
  };
}

/**
 * Get validated environment configuration
 * This function is safe to call on both server and client
 */
export function getEnvConfig(): LLMConfig {
  try {
    return parseEnvConfig();
  } catch (error) {
    // Always provide fallback config to prevent crashes
    console.warn('Environment config error, using fallback:', error);
    return {
      provider: 'anthropic',
      anthropicApiKey: '',
      openaiApiKey: '',
      anthropicModel: 'claude-3-5-sonnet-latest',
      openaiModel: 'gpt-4o-mini',
      timeoutMs: 60000,
      mockMode: true,
      showBuildInfo: true,
    };
  }
}

/**
 * Get server-only API keys (throws if called on client)
 */
export function getServerApiKeys(): { anthropicApiKey: string; openaiApiKey: string } {
  if (typeof window !== 'undefined') {
    throw new Error('API keys can only be accessed on the server');
  }
  
  const config = getEnvConfig();
  return {
    anthropicApiKey: config.anthropicApiKey,
    openaiApiKey: config.openaiApiKey,
  };
}

/**
 * Check if we're in mock mode (safe for client-side)
 */
export function isMockMode(): boolean {
  return getEnvConfig().mockMode;
}
