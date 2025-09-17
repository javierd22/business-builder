import { NextRequest, NextResponse } from 'next/server';
import { generateUX } from '@/lib/llm/client';
import { getClientIP, checkRateLimit } from '@/lib/rate-limit';
import { validateInput, shouldBlockForLLM } from '@/lib/security';
// import { buildUXPrompt, buildMockUX } from '@/lib/prompts';

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
    const { 
      prd, 
      persona, 
      job,
      providerOverride,
      modelOverride,
      temperature,
      depth,
      format,
      revision,
      promptVersion
    } = body;

    // Input validation
    if (!prd || typeof prd !== 'string') {
      return NextResponse.json(
        { message: 'Product Requirements Document is required' },
        { status: 400 }
      );
    }

    // Security validation
    const validation = validateInput(prd, { minChars: 50, maxChars: 50000 });
    if (validation.reasons.length > 0) {
      return NextResponse.json(
        { message: `Content validation failed: ${validation.reasons.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if content should be blocked from LLM
    const blockCheck = shouldBlockForLLM(prd);
    if (blockCheck.blocked) {
      return NextResponse.json(
        { message: `Content appears sensitive or inappropriate. Please revise and try again. Reasons: ${blockCheck.reasons.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if provider/model overrides are allowed
    const allowOverrides = process.env.ALLOW_PROVIDER_OVERRIDE === 'true' || process.env.NODE_ENV !== 'production';
    
    let effectiveProvider = providerOverride;
    let effectiveModel = modelOverride;
    
    if (!allowOverrides) {
      effectiveProvider = undefined;
      effectiveModel = undefined;
    }

    // Generate UX using LLM client with persona/job context
    // Note: Overrides are not yet supported in the LLM client
    const result = await generateUX(
      prd.trim(), 
      persona?.trim(), 
      job?.trim()
    );

    // Log successful generation
    console.log(`[${new Date().toISOString()}] UX generated: ${result.meta.provider}/${result.meta.model} - ${result.meta.durationMs}ms - ${result.meta.tokensUsed || 0} tokens${effectiveProvider ? ` (override: ${effectiveProvider})` : ''}`);

    return NextResponse.json({
      ux: result.ux,
      meta: result.meta,
    });

  } catch (error) {
    console.error('UX generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { message: 'Request timed out. Please try again with a shorter PRD.' },
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
      { message: 'Failed to generate UX. Please try again.' },
      { status: 500 }
    );
  }
}