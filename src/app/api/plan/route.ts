import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/llm/client';
import { getClientIP, checkRateLimit } from '@/lib/rate-limit';
import { buildPRDPrompt, buildMockPRD } from '@/lib/prompts';

const RATE_LIMIT_MAX_REQUESTS = 10;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          message: `Rate limit exceeded. Please try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60)} minutes.`,
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { idea, persona, job } = body;

    // Input validation
    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { message: 'Business idea is required' },
        { status: 400 }
      );
    }

    if (idea.trim().length < 10) {
      return NextResponse.json(
        { message: 'Business idea must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (idea.trim().length > 5000) {
      return NextResponse.json(
        { message: 'Business idea is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Basic profanity filter placeholder
    const profanityPattern = /\b(shit|fuck|damn|hell)\b/i;
    if (profanityPattern.test(idea)) {
      return NextResponse.json(
        { message: 'Please use professional language in your business idea' },
        { status: 400 }
      );
    }

    // Generate PRD using LLM client with persona/job context
    const result = await generatePlan(idea.trim(), persona?.trim(), job?.trim());

    // Log successful generation
    console.log(`[${new Date().toISOString()}] Plan generated: ${result.meta.provider}/${result.meta.model} - ${result.meta.durationMs}ms - ${result.meta.tokensUsed || 0} tokens`);

    return NextResponse.json({
      prd: result.prd,
      meta: result.meta,
    });

  } catch (error) {
    console.error('Plan generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { message: 'Request timed out. Please try again with a shorter idea.' },
          { status: 408 }
        );
      }
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { message: 'Service configuration error. Please try again later.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { message: 'Too many requests. Please wait a moment before trying again.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Failed to generate PRD. Please try again.' },
      { status: 500 }
    );
  }
}