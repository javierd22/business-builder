# Incident Playbook

## LLM Service Outage Response

### Immediate Response (0-5 minutes)
1. **Detect Outage**
   - [ ] Monitor API error rates >10%
   - [ ] Check provider status pages (Anthropic, OpenAI)
   - [ ] Verify network connectivity
   - [ ] Test authentication/API keys

2. **Enable Fallback Mode**
   ```typescript
   // Emergency fallback activation
   localStorage.setItem('EMERGENCY_MOCK_MODE', 'true');
   window.location.reload();
   ```
   - [ ] Activate mock response mode
   - [ ] Display service status banner
   - [ ] Switch to cached/template responses
   - [ ] Log outage event for tracking

3. **User Communication**
   - [ ] Display status banner: "AI services temporarily unavailable. Using demo mode."
   - [ ] Disable generate buttons with clear messaging
   - [ ] Provide estimated recovery time if known
   - [ ] Offer alternative workflows (templates, manual entry)

### Short-term Response (5-30 minutes)
1. **Provider Switching**
   ```typescript
   // Switch to backup provider
   const FALLBACK_CONFIG = {
     provider: 'openai', // if Anthropic down
     model: 'gpt-3.5-turbo',
     temperature: 0.7
   };
   ```
   - [ ] Attempt backup provider (Anthropic ↔ OpenAI)
   - [ ] Use budget models for cost control
   - [ ] Implement degraded service mode
   - [ ] Monitor backup provider performance

2. **Service Monitoring**
   - [ ] Set up automated health checks every 60 seconds
   - [ ] Track error rates and response times
   - [ ] Monitor user impact and abandonment
   - [ ] Document incident timeline

### Recovery (30+ minutes)
1. **Service Restoration**
   - [ ] Test primary provider functionality
   - [ ] Gradually restore full service
   - [ ] Remove status banners
   - [ ] Re-enable all features
   - [ ] Monitor for stability

2. **Post-Incident**
   - [ ] Analyze root cause
   - [ ] Review response effectiveness
   - [ ] Update monitoring thresholds
   - [ ] Improve fallback mechanisms

## Rate Limit Spike Response

### Detection Signals
- [ ] HTTP 429 errors from LLM APIs
- [ ] Sudden increase in user activity
- [ ] Unusual usage patterns (bot traffic)
- [ ] Cost alerts triggered

### Immediate Actions (0-2 minutes)
1. **Implement Emergency Limits**
   ```typescript
   const EMERGENCY_RATE_LIMITS = {
     requestsPerMinute: 5,    // down from 10
     requestsPerHour: 20,     // down from 60
     tokensPerRequest: 5000   // down from 10000
   };
   ```

2. **User Messaging**
   - [ ] Display rate limit banner
   - [ ] Show queue position/wait time
   - [ ] Suggest trying again in X minutes
   - [ ] Offer premium upgrade path (future)

### Traffic Management (2-15 minutes)
1. **Request Queuing**
   ```typescript
   // Simple queue implementation
   const requestQueue = [];
   const processQueue = async () => {
     if (requestQueue.length > 0) {
       const request = requestQueue.shift();
       await processWithDelay(request, 30000); // 30s delay
     }
   };
   ```

2. **Intelligent Routing**
   - [ ] Route simple requests to faster/cheaper models
   - [ ] Prioritize returning users over new users
   - [ ] Batch similar requests together
   - [ ] Cache common responses

### Capacity Scaling (15+ minutes)
1. **Provider Balancing**
   - [ ] Distribute load across Anthropic and OpenAI
   - [ ] Use multiple API keys if available
   - [ ] Implement round-robin request routing
   - [ ] Monitor per-provider quotas

2. **Service Degradation**
   - [ ] Reduce output quality (shorter responses)
   - [ ] Increase response caching duration
   - [ ] Limit revision iterations
   - [ ] Disable non-essential features

## Content Policy Flag Response

### Detection
- [ ] API returns content policy violation
- [ ] User reports inappropriate output
- [ ] Automated content scanning alerts
- [ ] Legal/compliance concerns raised

### Immediate Response (0-1 minute)
1. **Content Isolation**
   ```typescript
   // Flag and isolate problematic content
   const flagContent = (projectId: string, reason: string) => {
     const project = getProject(projectId);
     project.flags = project.flags || [];
     project.flags.push({
       type: 'content_policy',
       reason,
       timestamp: new Date().toISOString(),
       reviewed: false
     });
     updateProject(projectId, project);
   };
   ```

2. **User Communication**
   - [ ] Display generic error message (don't specify policy violation)
   - [ ] Suggest revising input and trying again
   - [ ] Provide content guidelines link
   - [ ] Offer manual review option

### Content Review (1-60 minutes)
1. **Manual Review Process**
   - [ ] Review flagged content for false positives
   - [ ] Determine if content is actually problematic
   - [ ] Check for prompt injection or adversarial inputs
   - [ ] Document patterns for prevention

2. **Response Actions**
   - [ ] **False Positive**: Restore content, improve filters
   - [ ] **Valid Flag**: Keep content blocked, refine prompts
   - [ ] **Borderline**: Provide alternative generation
   - [ ] **Serious Violation**: Escalate to legal review

### Prevention Updates (1+ hours)
1. **Prompt Engineering**
   ```typescript
   // Add safety guidelines to system prompts
   const SAFETY_GUIDELINES = `
   Ensure all output is:
   - Professional and business-appropriate
   - Compliant with content policies
   - Free of harmful or offensive content
   - Suitable for workplace environments
   `;
   ```

2. **Input Validation**
   - [ ] Improve content filtering before API calls
   - [ ] Add keyword blocklists
   - [ ] Implement sentiment analysis
   - [ ] Enhance prompt injection detection

## Rollback Procedures

### Code Rollback
1. **Vercel Deployment Rollback**
   ```bash
   # Rollback to previous deployment
   vercel rollback <deployment-id>
   
   # Or redeploy previous commit
   git revert HEAD
   git push origin main
   ```

2. **Feature Flag Rollback**
   ```typescript
   // Disable problematic features
   const EMERGENCY_FLAGS = {
     DISABLE_AI_GENERATION: true,
     FORCE_MOCK_MODE: true,
     DISABLE_NEW_FEATURES: true
   };
   ```

### Data Recovery
1. **LocalStorage Corruption**
   ```typescript
   // Repair corrupted localStorage
   const repairStorage = () => {
     try {
       const backup = localStorage.getItem('projects_backup');
       if (backup) {
         localStorage.setItem('projects', backup);
         return true;
       }
     } catch (error) {
       console.error('Storage repair failed:', error);
       return false;
     }
   };
   ```

2. **Project Recovery**
   - [ ] Provide export/import tools for data recovery
   - [ ] Implement automatic backup mechanisms
   - [ ] Offer manual data entry as fallback
   - [ ] Guide users through data reconstruction

## User Messaging Templates

### Service Outage Banner
```html
<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-700">
        <strong>Service Notice:</strong> AI generation is temporarily unavailable. Demo mode is active with sample content.
        <a href="/status" class="font-medium underline text-yellow-700 hover:text-yellow-600">
          Check status →
        </a>
      </p>
    </div>
  </div>
</div>
```

### Rate Limit Message
```html
<div class="bg-blue-50 border border-blue-200 rounded-md p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-blue-800">Generation limit reached</h3>
      <div class="mt-2 text-sm text-blue-700">
        <p>You've reached the hourly limit. Try again in {timeRemaining} minutes, or upgrade for higher limits.</p>
      </div>
    </div>
  </div>
</div>
```

### Content Policy Message
```html
<div class="bg-red-50 border border-red-200 rounded-md p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-red-800">Unable to generate content</h3>
      <div class="mt-2 text-sm text-red-700">
        <p>Please revise your input and try again. Ensure your business idea is appropriate for professional documentation.</p>
      </div>
      <div class="mt-4">
        <div class="-mx-2 -my-1.5 flex">
          <button type="button" class="bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50">
            View Guidelines
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Monitoring & Alerting

### Key Metrics to Monitor
- [ ] **API Error Rate**: >5% triggers investigation
- [ ] **Response Latency**: p95 >60s triggers alert
- [ ] **Cost Per Hour**: >$10/hour triggers review
- [ ] **User Success Rate**: <90% completion triggers analysis

### Alert Channels
1. **Console Logging**: All incidents logged locally
2. **User Notifications**: In-app status banners
3. **Email Alerts**: Critical incidents (future)
4. **Status Page**: Public incident communication (future)

### Incident Documentation
```typescript
interface Incident {
  id: string;
  type: 'outage' | 'rate_limit' | 'content_policy' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  endTime?: string;
  description: string;
  impact: string;
  resolution: string;
  preventionMeasures: string[];
}
```

## Recovery Testing

### Monthly Incident Drills
- [ ] **Outage Simulation**: Disable API keys and test fallback
- [ ] **Rate Limit Testing**: Trigger limits and verify handling
- [ ] **Content Policy**: Test with edge case inputs
- [ ] **Performance Degradation**: Simulate slow API responses

### Automated Testing
```bash
# Health check script
npm run test:health

# Stress testing
npm run test:load

# Fallback testing  
npm run test:fallback
```

### Success Criteria
- [ ] **Recovery Time**: <5 minutes to fallback mode
- [ ] **User Communication**: Clear messaging within 1 minute
- [ ] **Data Integrity**: No data loss during incidents
- [ ] **Service Continuity**: Core features remain functional
