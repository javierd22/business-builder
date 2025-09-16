# Cost Budget Per Run

## Token Targets by Step

### PRD Generation
- **Target Tokens**: 3,000-5,000 output tokens
- **Input Context**: 500-1,500 tokens (idea + persona/JTBD)
- **Total per Run**: ~4,000-6,500 tokens
- **Revision Factor**: 1.5x (accounting for iterations)

### UX Generation  
- **Target Tokens**: 4,000-6,000 output tokens
- **Input Context**: 3,500-5,500 tokens (PRD + persona/JTBD)
- **Total per Run**: ~7,500-11,500 tokens
- **Revision Factor**: 1.3x (less revision than PRD)

### Deploy Generation
- **Target Tokens**: 1,000-2,000 output tokens
- **Input Context**: 200-500 tokens (basic project info)
- **Total per Run**: ~1,200-2,500 tokens
- **Revision Factor**: 1.1x (minimal revision)

## Price Bands by Provider

### Anthropic Claude (Messages API)

#### Claude 3.5 Sonnet
- **Input**: $3.00 per 1M tokens
- **Output**: $15.00 per 1M tokens

**PRD Cost Breakdown:**
- Input: 1,000 tokens × $3.00/1M = $0.003
- Output: 4,000 tokens × $15.00/1M = $0.060
- **Total per PRD**: ~$0.063 ($0.095 with revisions)

**UX Cost Breakdown:**
- Input: 4,500 tokens × $3.00/1M = $0.0135
- Output: 5,000 tokens × $15.00/1M = $0.075
- **Total per UX**: ~$0.089 ($0.116 with revisions)

**Deploy Cost**: ~$0.020

**Complete Flow**: $0.175-$0.231

#### Claude 3 Haiku (Budget Option)
- **Input**: $0.25 per 1M tokens
- **Output**: $1.25 per 1M tokens

**Complete Flow**: $0.025-$0.035

### OpenAI GPT (Chat Completions API)

#### GPT-4 Turbo
- **Input**: $10.00 per 1M tokens
- **Output**: $30.00 per 1M tokens

**PRD Cost Breakdown:**
- Input: 1,000 tokens × $10.00/1M = $0.010
- Output: 4,000 tokens × $30.00/1M = $0.120
- **Total per PRD**: ~$0.130 ($0.195 with revisions)

**UX Cost Breakdown:**
- Input: 4,500 tokens × $10.00/1M = $0.045
- Output: 5,000 tokens × $30.00/1M = $0.150
- **Total per UX**: ~$0.195 ($0.254 with revisions)

**Deploy Cost**: ~$0.035

**Complete Flow**: $0.360-$0.484

#### GPT-3.5 Turbo (Budget Option)
- **Input**: $0.50 per 1M tokens
- **Output**: $1.50 per 1M tokens

**Complete Flow**: $0.020-$0.030

## Cost Per User Scenarios

### Light Usage (1 project/month)
- **Claude Sonnet**: $0.23/month
- **Claude Haiku**: $0.035/month
- **GPT-4 Turbo**: $0.48/month
- **GPT-3.5 Turbo**: $0.030/month

### Moderate Usage (5 projects/month)
- **Claude Sonnet**: $1.15/month
- **Claude Haiku**: $0.175/month
- **GPT-4 Turbo**: $2.40/month
- **GPT-3.5 Turbo**: $0.150/month

### Heavy Usage (20 projects/month)
- **Claude Sonnet**: $4.60/month
- **Claude Haiku**: $0.70/month
- **GPT-4 Turbo**: $9.60/month
- **GPT-3.5 Turbo**: $0.60/month

## Performance Targets

### Latency Targets (p50/p95)

#### PRD Generation
- **p50 Target**: <15 seconds
- **p95 Target**: <30 seconds
- **Timeout**: 60 seconds
- **Retry Strategy**: 1 retry on failure

#### UX Generation
- **p50 Target**: <20 seconds
- **p95 Target**: <40 seconds
- **Timeout**: 60 seconds
- **Retry Strategy**: 1 retry on failure

#### Deploy Generation
- **p50 Target**: <10 seconds
- **p95 Target**: <20 seconds
- **Timeout**: 30 seconds
- **Retry Strategy**: 1 retry on failure

### Quality vs. Speed Trade-offs
- **Fast Mode**: Lower temperature (0.3), shorter prompts, budget models
- **Balanced Mode**: Default settings, primary models (default)
- **Quality Mode**: Higher temperature (0.7), detailed prompts, premium models

## Cost Optimization Knobs

### Model Selection
```typescript
// Cost-conscious defaults
const MODEL_CONFIG = {
  development: {
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307',
    temperature: 0.5
  },
  production: {
    provider: 'anthropic', 
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7
  }
};
```

### Prompt Optimization
- [ ] **Concise Prompts**: Remove unnecessary context
- [ ] **Structured Output**: Use consistent formatting to reduce tokens
- [ ] **Context Reuse**: Cache common prompt components
- [ ] **Smart Truncation**: Limit input length based on importance

### Caching Strategy
- [ ] **Prompt Caching**: Cache system prompts (Anthropic feature)
- [ ] **Response Caching**: Store common responses locally
- [ ] **Context Compression**: Summarize long conversations
- [ ] **Selective History**: Only include relevant revision context

### Rate Limiting
```typescript
const RATE_LIMITS = {
  free: {
    requestsPerHour: 10,
    tokensPerDay: 50000
  },
  paid: {
    requestsPerHour: 100,
    tokensPerDay: 500000
  }
};
```

## Budget Monitoring

### Cost Tracking
```typescript
interface CostMetrics {
  totalTokens: number;
  estimatedCost: number;
  provider: 'anthropic' | 'openai';
  model: string;
  timestamp: string;
}
```

### Alert Thresholds
- [ ] **User Level**: Alert at $5/month usage
- [ ] **System Level**: Alert at $100/day aggregate
- [ ] **Model Level**: Switch to budget model at high volume
- [ ] **Error Level**: Disable service at $500/day

### Cost Analytics
- [ ] **Per-User Tracking**: Individual usage patterns
- [ ] **Feature Costs**: Cost breakdown by PRD/UX/Deploy
- [ ] **Quality Correlation**: Cost vs. user satisfaction scores
- [ ] **Efficiency Metrics**: Tokens per successful completion

## Emergency Cost Controls

### Circuit Breakers
- [ ] **Rate Limiting**: Max 100 requests/user/day
- [ ] **Token Limits**: Max 100k tokens/user/day
- [ ] **Cost Caps**: Max $10/user/month
- [ ] **System Limits**: Max $1000/day total

### Fallback Strategies
1. **Graceful Degradation**: Switch to budget models
2. **Queue System**: Delay non-urgent requests
3. **Mock Responses**: Serve cached/template responses
4. **Service Pause**: Temporarily disable AI features

### Cost Recovery
- [ ] **Usage Tracking**: Detailed logs for cost attribution
- [ ] **Billing Integration**: Future subscription model preparation
- [ ] **Fair Use**: Implement usage policies
- [ ] **Premium Features**: Cost-based feature gating

## Optimization Roadmap

### Phase 1: Baseline (Current)
- [ ] Basic cost tracking
- [ ] Model selection by environment
- [ ] Simple rate limiting
- [ ] Mock mode for development

### Phase 2: Efficiency (Next)
- [ ] Prompt optimization and caching
- [ ] Smart model routing
- [ ] Response quality scoring
- [ ] Usage analytics dashboard

### Phase 3: Intelligence (Future)
- [ ] Adaptive model selection
- [ ] Predictive cost management
- [ ] User behavior optimization
- [ ] Revenue optimization

## Cost-Quality Matrix

### High Quality, Low Cost (Ideal)
- **Strategy**: Optimized prompts + budget models
- **Use Case**: Simple, well-defined requests
- **Target**: Claude Haiku with quality prompts

### High Quality, High Cost (Premium)
- **Strategy**: Premium models + detailed prompts
- **Use Case**: Complex, creative requirements
- **Target**: GPT-4 Turbo or Claude Sonnet

### Medium Quality, Low Cost (Efficient)
- **Strategy**: Standard prompts + budget models
- **Use Case**: Bulk generation, iterations
- **Target**: GPT-3.5 Turbo baseline

### Low Quality, Low Cost (Fallback)
- **Strategy**: Simple prompts + mock responses
- **Use Case**: Demo mode, service outages
- **Target**: Local templates and samples
