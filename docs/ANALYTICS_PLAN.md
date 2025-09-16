# Analytics Plan

## Local Telemetry Events

### Core User Actions

#### Page Views
```typescript
{
  name: 'view',
  route: '/idea' | '/plan/review/[id]' | '/ux/preview/[id]' | '/deploy/[id]',
  ok: true,
  ms: 0,
  meta: {
    projectId?: string,
    hasProfile?: boolean,
    isReturning?: boolean
  }
}
```

#### CTA (Call-to-Action) Events
```typescript
{
  name: 'cta',
  route: string,
  ok: boolean,
  ms: number,
  meta: {
    action: 'generate-plan' | 'generate-ux' | 'deploy' | 'export-pdf' | 'export-markdown',
    projectId?: string,
    success?: boolean
  }
}
```

#### API Calls
```typescript
{
  name: 'api-call',
  route: '/api/plan' | '/api/ux' | '/api/deploy',
  ok: boolean,
  ms: number,
  meta: {
    provider?: 'anthropic' | 'openai',
    model?: string,
    error?: string,
    tokensUsed?: number,
    costEstimate?: number
  }
}
```

### Feature Usage

#### Profile Management
```typescript
{
  name: 'profile',
  route: '/onboarding' | '/settings',
  ok: boolean,
  ms: 0,
  meta: {
    action: 'created' | 'updated' | 'viewed',
    persona?: string,
    job?: string
  }
}
```

#### Export Actions
```typescript
{
  name: 'export',
  route: string,
  ok: boolean,
  ms: number,
  meta: {
    format: 'pdf' | 'markdown' | 'json',
    contentType: 'prd' | 'ux' | 'project',
    projectId: string,
    fileSize?: number
  }
}
```

#### Research & Surveys
```typescript
{
  name: 'survey',
  route: string,
  ok: boolean,
  ms: 0,
  meta: {
    assumptionId: string,
    choice: string,
    hasNote: boolean
  }
}
```

### Performance Metrics

#### Web Vitals
```typescript
{
  name: 'web-vitals',
  route: string,
  ok: boolean,
  ms: number,
  meta: {
    type: 'initial-load' | 'lcp' | 'cls',
    value?: number,
    element?: string
  }
}
```

#### Error Events
```typescript
{
  name: 'error',
  route: string,
  ok: false,
  ms: 0,
  meta: {
    type: 'api' | 'validation' | 'storage' | 'render',
    message: string,
    stack?: string,
    recoverable: boolean
  }
}
```

## Event Definitions

### Success Metrics
- **Primary Success**: Complete idea → deploy flow
- **Secondary Success**: Export generated content
- **Engagement Success**: Create multiple projects
- **Quality Success**: Rate content 4+ stars

### Conversion Events
- **Top of Funnel**: First page view
- **Interest**: Start idea input
- **Intent**: Submit idea for PRD generation
- **Activation**: Complete first PRD generation
- **Value**: Export or deploy content
- **Retention**: Return for second project

### Error Classifications
- **Recoverable**: User can retry and succeed
- **Blocking**: User cannot proceed without intervention
- **Data Loss**: LocalStorage corruption or loss
- **Service**: API or external service failures

## Funnel Definitions

### Primary Funnel: Idea to Deploy
1. **Landing** → Page load (`view: /`)
2. **Idea Entry** → Start typing (`view: /idea`)
3. **PRD Request** → Submit idea (`cta: generate-plan`)
4. **PRD Success** → Successful generation (`api-call: /api/plan`)
5. **UX Request** → Request UX generation (`cta: generate-ux`)
6. **UX Success** → Successful generation (`api-call: /api/ux`)
7. **Deploy Request** → Request deployment (`cta: deploy`)
8. **Deploy Success** → Successful deployment (`api-call: /api/deploy`)

### Secondary Funnel: Content Export
1. **Content View** → View generated PRD/UX
2. **Export Intent** → Click export button
3. **Export Success** → Download completes
4. **Export Usage** → User reports using exported content

### Onboarding Funnel
1. **First Visit** → Initial page load
2. **Onboarding Start** → Visit `/onboarding`
3. **Profile Creation** → Complete persona/JTBD selection
4. **First Project** → Create initial project
5. **First Success** → Complete first generation

## Experiment Tracking

### A/B Test Events
```typescript
{
  name: 'exp-view',
  route: string,
  ok: true,
  ms: 0,
  meta: {
    experiment: 'hero_copy_v1' | 'pricing_cta_label_v1',
    variant: 'A' | 'B',
    userId: string
  }
}
```

### Experiment Definitions

#### Hero Copy Test (hero_copy_v1)
- **Hypothesis**: Benefit-focused headlines convert better than feature-focused
- **Variants**:
  - A: "Turn Your Business Ideas Into Professional Plans"
  - B: "From Idea to Business Plan in Under 10 Minutes"
- **Primary Metric**: Click-through to `/idea`
- **Secondary Metrics**: Time on page, scroll depth

#### Pricing CTA Test (pricing_cta_label_v1)
- **Hypothesis**: Action-oriented CTAs convert better than generic ones
- **Variants**:
  - A: "Start Free Trial"
  - B: "Try Premium Features"
- **Primary Metric**: CTA click rate
- **Secondary Metrics**: Feature exploration, upgrade intent

#### Onboarding Flow Test (onboarding_flow_v1)
- **Hypothesis**: Mandatory onboarding improves personalization value
- **Variants**:
  - A: Optional onboarding (current)
  - B: Required onboarding before first project
- **Primary Metric**: PRD quality ratings
- **Secondary Metrics**: Completion rates, time to value

### Experiment Analysis
- **Sample Size**: Minimum 100 users per variant
- **Duration**: 1-2 weeks per experiment
- **Significance**: 95% confidence level
- **Effect Size**: Minimum 10% improvement to be meaningful

## Analytics Dashboard

### Real-Time Metrics (Updated Every Page Load)
- **Active Users**: Users with activity in last 24 hours
- **Error Rate**: % of failed API calls in last hour
- **Performance**: Average page load time
- **Success Rate**: % of users completing full funnel

### Daily Summary
- **New Users**: First-time visitors
- **Returning Users**: Users with previous sessions
- **Projects Created**: Total new projects
- **Content Generated**: PRDs + UX specs created
- **Exports**: Total downloads across all formats

### Weekly Analysis
- **Funnel Performance**: Conversion rates by step
- **Feature Adoption**: % of users using advanced features
- **Quality Scores**: Average content ratings
- **Experiment Results**: A/B test performance

### Monthly Deep Dive
- **User Segmentation**: Behavior patterns by persona/JTBD
- **Retention Analysis**: Repeat usage patterns
- **Content Analysis**: Most successful prompt patterns
- **Performance Trends**: Speed and reliability improvements

## Data Export & Analysis

### Export Formats
```typescript
// Daily export
{
  date: '2024-01-15',
  summary: {
    totalEvents: 1250,
    uniqueUsers: 87,
    completedFunnels: 23,
    averageSessionTime: 420
  },
  events: TelemetryEvent[],
  experiments: ExperimentResult[]
}
```

### Analysis Queries
```typescript
// Funnel conversion rates
const getFunnelConversion = (startDate: string, endDate: string) => {
  const events = getEventsByDateRange(startDate, endDate);
  return {
    landingToIdea: calculateConversion(events, 'view:/', 'view:/idea'),
    ideaToGenerate: calculateConversion(events, 'view:/idea', 'cta:generate-plan'),
    generateToSuccess: calculateConversion(events, 'cta:generate-plan', 'api-call:/api/plan:success')
  };
};

// Feature adoption rates
const getFeatureAdoption = () => {
  const totalUsers = getUniqueUsers();
  return {
    profileCreation: getUsersWithEvent('profile:created') / totalUsers,
    exportUsage: getUsersWithEvent('export:*') / totalUsers,
    multipleProjects: getUsersWithMultipleProjects() / totalUsers
  };
};
```

## Privacy & Data Handling

### Data Retention
- **Event Data**: 90 days in localStorage
- **User Preferences**: Persisted until manually cleared
- **Anonymous IDs**: Generated per browser, not linked to identity
- **Sensitive Data**: No PII stored in telemetry events

### Data Minimization
- **Event Payload**: Only essential fields included
- **User Content**: Not stored in telemetry (only metadata)
- **IP Addresses**: Not collected or stored
- **Timestamps**: Relative times only, no absolute timestamps

### User Control
- **Opt-Out**: Users can disable analytics in settings
- **Data Export**: Users can export their telemetry data
- **Data Deletion**: Users can clear all stored analytics
- **Transparency**: Clear documentation of what's tracked

## Readout Cadence

### Daily Standup (5 minutes)
- **Health Check**: Error rates, performance alerts
- **Usage Summary**: New users, active projects
- **Critical Issues**: Any blockers or incidents

### Weekly Review (30 minutes)
- **Funnel Analysis**: Week-over-week conversion trends
- **Feature Performance**: Adoption and usage patterns
- **Experiment Updates**: A/B test progress and early signals
- **User Feedback**: Qualitative insights and issues

### Monthly Business Review (60 minutes)
- **Growth Metrics**: User acquisition and retention
- **Product Performance**: Feature success and failures
- **Experiment Results**: Completed A/B tests and learnings
- **Strategic Planning**: Next month's experiment pipeline

### Quarterly Deep Dive (Half Day)
- **User Research**: Detailed behavior analysis
- **Product Strategy**: Feature roadmap based on data
- **Performance Optimization**: Technical improvements needed
- **Market Analysis**: Competitive positioning and opportunities

## Success Criteria

### Engagement Targets
- **Weekly Active Users**: >50% of monthly users
- **Session Duration**: >5 minutes average
- **Multi-Project Users**: >30% create 2+ projects
- **Feature Adoption**: >40% use advanced features

### Conversion Targets
- **Idea to PRD**: >80% conversion rate
- **PRD to UX**: >70% conversion rate
- **UX to Deploy**: >60% conversion rate
- **End-to-End**: >35% complete full funnel

### Quality Targets
- **Content Satisfaction**: >4.0/5.0 average rating
- **Technical Performance**: >95% API success rate
- **User Experience**: <5% error-related abandonment
- **Export Usage**: >50% export generated content
