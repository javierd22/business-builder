/**
 * Provider-agnostic LLM client with Anthropic and OpenAI adapters
 */

import { getEnvConfig, getServerApiKeys, isMockMode } from '../env';
import { buildPRDPrompt, buildUXPrompt, buildMockPRD, buildMockUX } from '../prompts';

export interface ProviderMeta {
  provider: string;
  model: string;
  durationMs: number;
  tokensUsed?: number;
  costEstimate?: number;
}

export interface PlanResult {
  prd: string;
  meta: ProviderMeta;
}

export interface UXResult {
  ux: string;
  meta: ProviderMeta;
}

/**
 * Generate a Product Requirements Document
 */
export async function generatePlan(idea: string, persona?: string, job?: string): Promise<PlanResult> {
  
  if (isMockMode()) {
    return {
      prd: buildMockPRD({ idea, persona, job }),
      meta: {
        provider: 'mock',
        model: 'sample',
        durationMs: 100,
        tokensUsed: 0,
        costEstimate: 0,
      },
    };
  }

  const config = getEnvConfig();
  const { anthropicApiKey, openaiApiKey } = getServerApiKeys();

  try {
    if (config.provider === 'anthropic') {
      return await generatePlanWithAnthropic(idea, anthropicApiKey, config.anthropicModel, config.timeoutMs, persona, job);
    } else {
      return await generatePlanWithOpenAI(idea, openaiApiKey, config.openaiModel, config.timeoutMs, persona, job);
    }
  } catch (error) {
    console.error('Plan generation error:', error);
    throw new Error('Failed to generate PRD. Please try again.');
  }
}

/**
 * Generate a UX specification
 */
export async function generateUX(prd: string, persona?: string, job?: string): Promise<UXResult> {
  
  if (isMockMode()) {
    return {
      ux: buildMockUX({ idea: prd, persona, job }),
      meta: {
        provider: 'mock',
        model: 'sample',
        durationMs: 100,
        tokensUsed: 0,
        costEstimate: 0,
      },
    };
  }

  const config = getEnvConfig();
  const { anthropicApiKey, openaiApiKey } = getServerApiKeys();

  try {
    if (config.provider === 'anthropic') {
      return await generateUXWithAnthropic(prd, anthropicApiKey, config.anthropicModel, config.timeoutMs, persona, job);
    } else {
      return await generateUXWithOpenAI(prd, openaiApiKey, config.openaiModel, config.timeoutMs, persona, job);
    }
  } catch (error) {
    console.error('UX generation error:', error);
    throw new Error('Failed to generate UX specification. Please try again.');
  }
}

/**
 * Anthropic Claude implementation for plan generation
 */
async function generatePlanWithAnthropic(
  idea: string,
  apiKey: string,
  model: string,
  timeoutMs: number,
  persona?: string,
  job?: string
): Promise<PlanResult> {
  const startTime = Date.now();
  
  const systemPrompt = buildPRDPrompt({ idea, persona, job });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a PRD for this business idea: ${idea}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const prd = data.content?.[0]?.text || '';
  
  if (!prd) {
    throw new Error('No content received from Anthropic');
  }

  return {
    prd,
    meta: {
      provider: 'anthropic',
      model,
      durationMs: Date.now() - startTime,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      costEstimate: calculateAnthropicCost(data.usage, model),
    },
  };
}

/**
 * OpenAI implementation for plan generation
 */
async function generatePlanWithOpenAI(
  idea: string,
  apiKey: string,
  model: string,
  timeoutMs: number,
  persona?: string,
  job?: string
): Promise<PlanResult> {
  const startTime = Date.now();
  
  const systemPrompt = buildPRDPrompt({ idea, persona, job });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a PRD for this business idea: ${idea}` },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const prd = data.choices?.[0]?.message?.content || '';
  
  if (!prd) {
    throw new Error('No content received from OpenAI');
  }

  return {
    prd,
    meta: {
      provider: 'openai',
      model,
      durationMs: Date.now() - startTime,
      tokensUsed: data.usage?.total_tokens,
      costEstimate: calculateOpenAICost(data.usage, model),
    },
  };
}

/**
 * Anthropic Claude implementation for UX generation
 */
async function generateUXWithAnthropic(
  prd: string,
  apiKey: string,
  model: string,
  timeoutMs: number,
  persona?: string,
  job?: string
): Promise<UXResult> {
  const startTime = Date.now();
  
  const systemPrompt = buildUXPrompt({ idea: prd, persona, job });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a UX specification based on this PRD:\n\n${prd}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const ux = data.content?.[0]?.text || '';
  
  if (!ux) {
    throw new Error('No content received from Anthropic');
  }

  return {
    ux,
    meta: {
      provider: 'anthropic',
      model,
      durationMs: Date.now() - startTime,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      costEstimate: calculateAnthropicCost(data.usage, model),
    },
  };
}

/**
 * OpenAI implementation for UX generation
 */
async function generateUXWithOpenAI(
  prd: string,
  apiKey: string,
  model: string,
  timeoutMs: number,
  persona?: string,
  job?: string
): Promise<UXResult> {
  const startTime = Date.now();
  
  const systemPrompt = buildUXPrompt({ idea: prd, persona, job });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a UX specification based on this PRD:\n\n${prd}` },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const ux = data.usage?.choices?.[0]?.message?.content || '';
  
  if (!ux) {
    throw new Error('No content received from OpenAI');
  }

  return {
    ux,
    meta: {
      provider: 'openai',
      model,
      durationMs: Date.now() - startTime,
      tokensUsed: data.usage?.total_tokens,
      costEstimate: calculateOpenAICost(data.usage, model),
    },
  };
}

/**
 * Generate mock PRD for demo purposes
 */
/*
function generateMockPRD(idea: string): string {
  return `# Product Requirements Document

## Executive Summary
**Business Idea:** ${idea}

This document outlines the requirements for developing a comprehensive business solution that addresses specific market needs and user challenges in the target domain.

## Problem Statement
The current market lacks a streamlined solution that effectively addresses the core challenges identified in this business domain. Users struggle with fragmented tools and processes that don't integrate well together.

## Target Audience
- **Primary Users:** Business professionals and entrepreneurs
- **Secondary Users:** Stakeholders and decision makers  
- **Market Segment:** Small to medium enterprises

## Value Proposition
- Streamlined workflow integration
- Reduced time-to-market for business initiatives
- Improved user experience and satisfaction
- Cost-effective solution for growing businesses

## Core Features
1. **User Authentication** - Secure login and registration system
2. **Dashboard** - Comprehensive overview with key metrics and insights
3. **Data Management** - Create, read, update, and delete operations
4. **Reporting** - Analytics and insights generation
5. **Mobile Support** - Responsive design for all devices
6. **Integration** - Connect with existing business tools
7. **Notifications** - Real-time updates and alerts

## Success Metrics
- User adoption rate: 80% within first quarter
- System uptime: 99.9% availability
- User satisfaction: 4.5+ star rating
- Time to value: < 30 days for new users

## Implementation Timeline
- **Phase 1 (MVP):** 6-8 weeks
- **Phase 2 (Enhancement):** 4-6 weeks  
- **Phase 3 (Scale):** Ongoing iterations

## Risk Assessment
- **Technical Risk:** Medium - requires integration with multiple systems
- **Market Risk:** Low - clear demand for solution
- **Resource Risk:** Medium - requires skilled development team
- **Timeline Risk:** Low - well-defined scope and requirements`;
}
*/

/**
 * Generate mock UX specification for demo purposes
 */
/*
function generateMockUX(prd: string): string {
  return `# User Experience Design

## Design Principles
- **Simplicity:** Clean, intuitive interface design
- **Accessibility:** WCAG 2.1 AA compliance throughout
- **Consistency:** Unified design language and patterns
- **Performance:** Fast loading times and smooth interactions

## Information Architecture
- **Primary Navigation:** Dashboard, Projects, Analytics, Settings
- **Secondary Navigation:** User profile, Help, Notifications
- **Content Hierarchy:** Clear information prioritization

## Primary User Flows

### User Onboarding
1. **Landing Page** - Clear value proposition and call-to-action
2. **Registration** - Streamlined 3-step signup process
3. **Dashboard Setup** - Guided tour and initial configuration
4. **First Project** - Template-based project creation

### Core Workflow
1. **Project Creation** - Intuitive project setup wizard
2. **Data Entry** - Form-based data input with validation
3. **Review & Edit** - Real-time preview and editing capabilities
4. **Publish & Share** - Export and sharing options

## Screen Descriptions

### Dashboard
- Overview cards with key metrics
- Recent activity feed
- Quick action buttons
- Navigation sidebar

### Project List
- Grid/list view toggle
- Search and filter controls
- Project status indicators
- Bulk action options

### Project Detail
- Tabbed interface for different views
- Real-time collaboration indicators
- Version history and comments
- Export and sharing controls

### Settings
- User profile management
- Notification preferences
- Integration settings
- Billing and subscription info

## Interaction Patterns
- **Hover States:** Subtle animations and visual feedback
- **Loading States:** Skeleton screens and progress indicators
- **Error Handling:** Clear error messages with recovery actions
- **Success Feedback:** Toast notifications and confirmation dialogs

## Accessibility Considerations
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management and indicators

## Edge Cases and Error States
- **Network Issues:** Offline mode with sync indicators
- **Validation Errors:** Inline error messages with suggestions
- **Empty States:** Helpful illustrations and guidance
- **Permission Errors:** Clear explanation and next steps`;
}
*/

/**
 * Calculate cost estimate for Anthropic usage
 */
function calculateAnthropicCost(usage: unknown, model: string): number {
  if (!usage) return 0;
  
  // Type guard for usage object
  const usageData = usage as Record<string, unknown>;
  if (typeof usageData.input_tokens !== 'number' || typeof usageData.output_tokens !== 'number') {
    return 0;
  }
  
  // Rough cost estimates (per 1M tokens)
  const costs = {
    'claude-3-5-sonnet-latest': { input: 3.00, output: 15.00 },
    'claude-3-5-haiku-latest': { input: 0.80, output: 4.00 },
    'claude-3-opus-latest': { input: 15.00, output: 75.00 },
  };
  
  const modelCost = costs[model as keyof typeof costs] || costs['claude-3-5-sonnet-latest'];
  const inputCost = (usageData.input_tokens / 1000000) * modelCost.input;
  const outputCost = (usageData.output_tokens / 1000000) * modelCost.output;
  
  return inputCost + outputCost;
}

/**
 * Calculate cost estimate for OpenAI usage
 */
function calculateOpenAICost(usage: unknown, model: string): number {
  if (!usage) return 0;
  
  // Type guard for usage object
  const usageData = usage as Record<string, unknown>;
  if (typeof usageData.prompt_tokens !== 'number' || typeof usageData.completion_tokens !== 'number') {
    return 0;
  }
  
  // Rough cost estimates (per 1M tokens)
  const costs = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
  };
  
  const modelCost = costs[model as keyof typeof costs] || costs['gpt-4o-mini'];
  const inputCost = (usageData.prompt_tokens / 1000000) * modelCost.input;
  const outputCost = (usageData.completion_tokens / 1000000) * modelCost.output;
  
  return inputCost + outputCost;
}
