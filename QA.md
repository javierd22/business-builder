# Business Builder - QA Guide

## Overview

This guide provides comprehensive testing instructions for the Business Builder application with dual-provider LLM support (Anthropic Claude and OpenAI ChatGPT).

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the project root with these variables:

```bash
# LLM Provider Configuration
LLM_PROVIDER=anthropic  # or 'openai'
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
OPENAI_MODEL=gpt-4o-mini
LLM_TIMEOUT_MS=60000

# Public Configuration
NEXT_PUBLIC_MOCK_AI=true  # Set to false for real AI calls
NEXT_PUBLIC_SHOW_BUILD_INFO=true
```

### Vercel Deployment Setup

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add these variables:**
   - `LLM_PROVIDER` = `anthropic` (Preview + Production)
   - `ANTHROPIC_API_KEY` = `your_key` (Server only)
   - `OPENAI_API_KEY` = `your_key` (Server only)
   - `ANTHROPIC_MODEL` = `claude-3-5-sonnet-latest`
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `LLM_TIMEOUT_MS` = `60000`
   - `NEXT_PUBLIC_MOCK_AI` = `true` (Preview only, for demos)
   - `NEXT_PUBLIC_SHOW_BUILD_INFO` = `true`

3. **Redeploy** → Clear build cache → Confirm new SHA in BuildInfo badge

## 5-Minute Smoke Test

### Test 1: Mock Mode (No API Keys Required)

1. **Start the app** with `NEXT_PUBLIC_MOCK_AI=true`
2. **Navigate to** `/idea`
3. **Enter a business idea:** "A mobile app for tracking daily habits"
4. **Click "Generate PRD"** → Should complete instantly with sample content
5. **Verify PRD page** shows mock content with "Generated with mock/sample" metadata
6. **Click "Generate UX Design"** → Should complete instantly
7. **Verify UX page** shows mock content with metadata
8. **Click "Deploy Project"** → Should show deployment status

**Expected Results:**
- All steps complete in < 2 seconds
- Content is deterministic and professional
- Metadata shows "mock" provider
- No API calls made

### Test 2: Real Anthropic Provider

1. **Set environment variables:**
   ```bash
   LLM_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your_real_key
   NEXT_PUBLIC_MOCK_AI=false
   ```

2. **Redeploy** and verify BuildInfo shows new SHA

3. **Repeat Test 1** with real API calls

**Expected Results:**
- PRD generation takes 5-15 seconds
- Content is unique and detailed
- Metadata shows "anthropic" provider with real model
- Cost estimates appear in metadata

### Test 3: Real OpenAI Provider

1. **Set environment variables:**
   ```bash
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_real_key
   NEXT_PUBLIC_MOCK_AI=false
   ```

2. **Redeploy** and verify BuildInfo shows new SHA

3. **Repeat Test 1** with real API calls

**Expected Results:**
- PRD generation takes 3-10 seconds
- Content is unique and detailed
- Metadata shows "openai" provider with real model
- Cost estimates appear in metadata

## Error Simulation Tests

### Test 4: Network Error Simulation

1. **Disconnect from internet**
2. **Try to generate PRD** with real provider
3. **Expected:** Friendly error message with retry option
4. **Reconnect and retry** → Should work

### Test 5: Invalid Input Testing

1. **Test short ideas** (< 10 characters)
   - **Expected:** "Business idea must be at least 10 characters long"

2. **Test empty ideas**
   - **Expected:** "Business idea is required"

3. **Test very long ideas** (> 5000 characters)
   - **Expected:** "Business idea is too long (max 5000 characters)"

4. **Test profanity** (if implemented)
   - **Expected:** "Please use professional language"

### Test 6: Rate Limiting

1. **Make 10+ rapid requests** to `/api/plan`
2. **Expected:** 429 status with retry-after header
3. **Wait for reset** → Should work again

## Settings Page Testing

### Test 7: Settings UI

1. **Navigate to** `/settings`
2. **Verify display shows:**
   - Current provider (anthropic/openai)
   - Current model
   - Mock mode status
   - Build info visibility
   - API key status (configured/not required)

3. **Test quick action buttons:**
   - Vercel Dashboard (opens in new tab)
   - Anthropic Console (opens in new tab)
   - OpenAI Platform (opens in new tab)
   - Refresh Settings (reloads page)

## API Endpoint Testing

### Test 8: Direct API Testing

**Test Plan Generation:**
```bash
curl -X POST http://localhost:3000/api/plan \
  -H "Content-Type: application/json" \
  -d '{"idea": "A web app for managing team projects"}'
```

**Expected Response:**
```json
{
  "prd": "# Product Requirements Document...",
  "meta": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-latest",
    "durationMs": 5000,
    "tokensUsed": 1500,
    "costEstimate": 0.0045
  }
}
```

## Success Criteria

✅ **All tests pass** with both providers
✅ **Mock mode works** without API keys
✅ **Real providers work** with valid keys
✅ **Error handling** is user-friendly
✅ **Rate limiting** prevents abuse
✅ **Settings page** shows correct info
✅ **BuildInfo** updates on deployment
✅ **No API keys** exposed to client
✅ **TypeScript** compiles without errors
✅ **Beige/gold styling** is consistent

## Privacy Notes

- **Only business idea text** is sent to LLM providers
- **No personal information** is collected or stored
- **API keys** never leave the server
- **Project data** is stored locally in browser only
- **No tracking** or analytics beyond basic usage