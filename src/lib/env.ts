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
  
  if (!provider || !['anthropic', 'openai'].includes(provider)) {
    throw new Error('LLM_PROVIDER must be either "anthropic" or "openai"');
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
  const openaiApiKey = process.env.OPENAI_API_KEY || '';
  
  if (provider === 'anthropic' && !anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic');
  }
  
  if (provider === 'openai' && !openaiApiKey) {
    throw new Error('OPENAI_API_KEY is required when LLM_PROVIDER=openai');
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
    // In development, provide fallback config
    if (process.env.NODE_ENV === 'development') {
      console.warn('Environment config error:', error);
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
    throw error;
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
