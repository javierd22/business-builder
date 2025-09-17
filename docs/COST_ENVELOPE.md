# Cost Envelope & Performance Management

This document outlines the cost model, latency targets, and performance optimization strategies for the Business Builder application.

## Cost Model

### Provider Pricing Tables

The application maintains pricing tables for major LLM providers (as of 2024):

#### OpenAI Models
- **gpt-4o**: $2.50/1M input tokens, $10.00/1M output tokens
- **gpt-4o-mini**: $0.15/1M input tokens, $0.60/1M output tokens  
- **gpt-3.5-turbo**: $0.50/1M input tokens, $1.50/1M output tokens

#### Anthropic Models
- **claude-3-5-sonnet-latest**: $3.00/1M input tokens, $15.00/1M output tokens
- **claude-3-5-sonnet**: $3.00/1M input tokens, $15.00/1M output tokens
- **claude-3-haiku**: $0.25/1M input tokens, $1.25/1M output tokens
- **claude-3-opus**: $15.00/1M input tokens, $75.00/1M output tokens

### Token Estimation

The application uses a heuristic token estimation method:
- **Rule of thumb**: ~4 characters per token for English text
- **Adjustments**: Word-heavy content gets slight upward adjustment
- **Bounds**: Minimum 10 tokens, maximum 100,000 tokens per estimate

### Cost Calculation

Costs are calculated using:
1. **Preferred method**: Actual token usage from provider meta (when available)
2. **Fallback method**: Heuristic estimation from text length
3. **Formula**: `(inputTokens / 1M) × inputRate + (outputTokens / 1M) × outputRate`

### Typical Token Budgets

#### Plan Generation
- **Input**: ~500 tokens (business idea + context)
- **Output**: ~2,000 tokens (typical PRD length)
- **Baseline cost**: ~$0.05

#### UX Generation  
- **Input**: ~2,000 tokens (PRD as input)
- **Output**: ~1,500 tokens (UX specification)
- **Baseline cost**: ~$0.04

## Latency Envelope

### Performance Targets

| Step | p50 Target | p95 Target | Notes |
|------|------------|------------|-------|
| Plan Generation | 10 seconds | 30 seconds | Business plan creation |
| UX Generation | 12 seconds | 40 seconds | UX specification creation |

### Timeout Configuration

- **Default Timeout**: 60 seconds (user-configurable)
- **Fallback Timeout**: 25 seconds for retry attempts
- **Strategy**: Primary attempt → Fallback attempt → User notification

### Fallback Strategy

When latency targets are exceeded or timeouts occur:

1. **Parameter Reduction**:
   - Depth: `deep` → `standard` → `brief`
   - Temperature: Reduced by 0.1 (minimum 0.3)
   - Format: `markdown` → `bulleted`
   - Revision notes: Cleared for consistency

2. **Timeout Handling**:
   - AbortController with configurable timeouts
   - One fallback attempt with lighter parameters
   - User notification with retry options

## Local Caching System

### Cache Strategy

- **Key Generation**: Deterministic hash of input parameters
- **Storage**: localStorage with LRU eviction (max 100 entries)
- **Expiry**: 24 hours per entry
- **Scope**: Cached per step (plan/ux), idea, persona, job, and parameters

### Cache Benefits

- **Cost Reduction**: Avoid duplicate API calls
- **Performance**: Instant responses for repeated inputs
- **User Experience**: Faster iteration and testing

### Cache Management

- **Global Toggle**: Enable/disable caching in settings
- **Manual Clear**: Clear cache button in performance dashboard
- **Hit Rate Tracking**: Monitor cache effectiveness

## Performance Dashboard

### Key Metrics

#### Latency Monitoring
- **Target vs Actual**: p50 and p95 comparisons
- **Status Indicators**: Green (within target), Red (exceeded)
- **Warnings**: Automatic alerts when targets are missed

#### Cost Tracking
- **Daily Estimates**: Total cost, average per call, breakdown by provider
- **Efficiency Ratings**: Excellent/Good/Fair/Expensive based on baseline costs
- **Cache Impact**: Hit rate and cost savings

#### Settings Controls
- **Default Parameters**: Temperature, depth, format, timeout
- **Cache Management**: Enable/disable, clear cache
- **Observability**: Clear logs, export data

### Dashboard Navigation

Access via: **Settings** → **Performance & Cost**

## Failure UX & Recovery

### Timeout Handling

When requests exceed timeouts:

1. **Automatic Fallback**: Lighter parameters on timeout
2. **User Notification**: Clear explanation of what happened
3. **Recovery Options**:
   - Try brief version immediately
   - Retry with original parameters
   - Dismiss and continue

### Error Classification

- **Network Errors**: Retry with exponential backoff
- **Timeout Errors**: Fallback to lighter parameters
- **Rate Limiting**: Automatic retry with backoff
- **Client Errors (4xx)**: No retry, show user-friendly message

## Configuration Knobs

### User Settings

| Setting | Default | Range | Impact |
|---------|---------|-------|---------|
| Default Temperature | 0.7 | 0.0-1.0 | Creativity vs consistency |
| Default Depth | standard | brief/standard/deep | Detail level |
| Default Format | markdown | markdown/bulleted | Output structure |
| Default Timeout | 60s | 10s-300s | Response patience |
| Cache Enabled | true | boolean | Performance vs freshness |

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_MOCK_AI` | Enable mock responses | false |
| `LLM_TIMEOUT_MS` | Server-side timeout | 60000 |
| `ALLOW_PROVIDER_OVERRIDE` | Dev override capability | false |

## Example Calculations

### Plan Generation Cost

**Input**: "Create a fitness tracking app for busy professionals"
- Estimated input tokens: ~500
- Estimated output tokens: ~2,000

**Using gpt-4o-mini**:
- Input cost: (500/1M) × $0.15 = $0.000075
- Output cost: (2,000/1M) × $0.60 = $0.0012
- **Total**: $0.001275

**Using claude-3-5-sonnet**:
- Input cost: (500/1M) × $3.00 = $0.0015
- Output cost: (2,000/1M) × $15.00 = $0.03
- **Total**: $0.0315

### Performance Impact

**Cache Hit**: 0ms response time, $0 cost
**Cache Miss**: 10-40s response time, $0.001-$0.03 cost

## Best Practices

### Cost Optimization

1. **Enable Caching**: Reduces duplicate API calls
2. **Use Appropriate Models**: Mini models for testing, full models for production
3. **Monitor Daily Usage**: Set up alerts for unusual cost spikes
4. **Batch Similar Requests**: Group related ideas for efficiency

### Performance Optimization

1. **Set Realistic Timeouts**: Balance user patience with model capabilities
2. **Use Fallback Parameters**: Ensure graceful degradation
3. **Monitor p95 Targets**: Address performance issues proactively
4. **Regular Cache Maintenance**: Clear old entries periodically

### User Experience

1. **Clear Communication**: Explain delays and fallback attempts
2. **Recovery Options**: Provide multiple retry strategies
3. **Progress Indication**: Show loading states and timeouts
4. **Cost Transparency**: Display estimates when relevant

## Troubleshooting

### High Costs

1. **Check Cache Hit Rate**: Should be >50% for repeated inputs
2. **Review Model Selection**: Consider cheaper models for testing
3. **Analyze Token Usage**: Look for unusually long outputs
4. **Monitor Daily Patterns**: Identify cost spikes

### Poor Performance

1. **Check p95 Targets**: Ensure they're being met
2. **Review Timeout Settings**: May need adjustment for model
3. **Monitor Fallback Usage**: High fallback rate indicates issues
4. **Check Network Conditions**: May affect response times

### Cache Issues

1. **Verify Cache Enabled**: Check settings
2. **Clear and Reset**: Sometimes fixes corruption
3. **Check Storage Quota**: localStorage may be full
4. **Monitor Hit Rate**: Low rates may indicate poor key generation

## Future Enhancements

### Planned Features

1. **Predictive Caching**: Pre-cache likely requests
2. **Cost Budgets**: Set daily/monthly limits
3. **A/B Testing**: Compare model performance
4. **Advanced Analytics**: Detailed usage patterns
5. **Smart Fallbacks**: ML-based parameter optimization

### Monitoring Improvements

1. **Real-time Alerts**: Push notifications for issues
2. **Historical Trends**: Long-term performance tracking
3. **Provider Comparison**: Side-by-side model analysis
4. **Cost Forecasting**: Predict future usage and costs

