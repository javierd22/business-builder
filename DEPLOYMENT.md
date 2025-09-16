# Business Builder - Deployment Guide

## Quick Fix for "Service Temporarily Unavailable" Error

If you're seeing a "Service temporarily unavailable" error, it's likely due to missing environment variables in your Vercel deployment.

### Option 1: Enable Mock Mode (Quickest Fix)

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to the "Environment Variables" section
4. Add these variables:

```
NEXT_PUBLIC_MOCK_AI=true
NEXT_PUBLIC_SHOW_BUILD_INFO=true
```

5. Redeploy your project

### Option 2: Set Up Real LLM Integration

For full functionality, add these environment variables in Vercel:

#### Required Variables:
```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_MOCK_AI=false
NEXT_PUBLIC_SHOW_BUILD_INFO=true
```

#### Optional Variables:
```
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
LLM_TIMEOUT_MS=60000
```

### Option 3: Use OpenAI Instead

If you prefer OpenAI:

```
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_MOCK_AI=false
NEXT_PUBLIC_SHOW_BUILD_INFO=true
```

## Getting API Keys

### Anthropic (Claude)
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key and add it to Vercel

### OpenAI
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key and add it to Vercel

## After Adding Environment Variables

1. Save the environment variables in Vercel
2. Go to the "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Wait for the deployment to complete

## Verification

After deployment, you should see:
- The main landing page loads without errors
- The "Start Building" button works
- You can create new projects
- Mock mode will show sample content if no API keys are provided

## Troubleshooting

If you still see errors:
1. Check the Vercel function logs for specific error messages
2. Ensure all environment variables are set correctly
3. Verify your API keys are valid and have sufficient credits
4. Try enabling mock mode first to test basic functionality

## Local Development

For local development, create a `.env.local` file:

```env
# LLM Configuration
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
OPENAI_MODEL=gpt-4o-mini
LLM_TIMEOUT_MS=60000

# Public flags
NEXT_PUBLIC_MOCK_AI=true
NEXT_PUBLIC_SHOW_BUILD_INFO=true
```

Then run:
```bash
npm run dev
```
