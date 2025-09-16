# Business Builder - Quality Assurance Guide

## 🚀 10-Minute Smoke Test

### Prerequisites
- Node.js 18+ installed
- Environment variables configured (see Environment Setup below)
- Browser with developer tools

### Quick Start
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📋 Full Flow Walkthrough

### 1. Onboarding Flow
**Path:** `/` → Complete onboarding → `/onboarding`

**Expected Behavior:**
- [ ] Homepage shows onboarding prompt if no profile exists
- [ ] Onboarding page displays 4 persona options (Solopreneur, SMB Owner, Agency, PM/Founder)
- [ ] Onboarding page displays 4 job options (Launch MVP, Validate Market, Automate Ops, Pitch Deck)
- [ ] Selection shows visual feedback with gold focus rings
- [ ] "Continue" button is disabled until both selections made
- [ ] Profile saves to localStorage and redirects to `/idea?onboarded=true`
- [ ] Settings page shows current profile with edit options

**Test Data:**
- Persona: "Solopreneur"
- Job: "Launch MVP"

### 2. Idea Creation Flow
**Path:** `/idea` → Submit idea → Generate PRD

**Expected Behavior:**
- [ ] Page shows FlowSteps component with "Idea" step highlighted
- [ ] Textarea has personalized placeholder based on profile
- [ ] Character counter shows "0/5000 characters"
- [ ] Submit button disabled until minimum 10 characters
- [ ] Loading state shows during PRD generation
- [ ] Success redirects to `/plan/review/[projectId]`
- [ ] Error handling shows user-friendly messages

**Test Data:**
```
Create a mobile app that helps small restaurants manage their inventory and reduce food waste through AI-powered demand forecasting.
```

### 3. PRD Review Flow
**Path:** `/plan/review/[projectId]` → Review PRD → Generate UX

**Expected Behavior:**
- [ ] Page shows FlowSteps with "PRD Review" step highlighted
- [ ] PRD content displays with proper formatting
- [ ] Persona context shows "Tailored for [persona] to [job]"
- [ ] Export buttons work: Markdown, PDF, Project JSON
- [ ] "Generate UX" button triggers UX generation
- [ ] Loading state during UX generation
- [ ] Success redirects to `/ux/preview/[projectId]`
- [ ] Empty state shows if PRD missing

**Export Tests:**
- [ ] PRD Markdown download works
- [ ] PRD PDF opens print dialog
- [ ] Project JSON download works

### 4. UX Preview Flow
**Path:** `/ux/preview/[projectId]` → Review UX → Deploy

**Expected Behavior:**
- [ ] Page shows FlowSteps with "UX Preview" step highlighted
- [ ] UX content displays with proper formatting
- [ ] Persona context shows "Tailored for [persona] to [job]"
- [ ] Export buttons work: Markdown, PDF, Project JSON
- [ ] "Deploy Project" button triggers deployment
- [ ] Loading state during deployment
- [ ] Success shows deployment status
- [ ] Empty state shows if UX missing

### 5. Deploy Flow
**Path:** `/deploy/[projectId]` → View deployment status

**Expected Behavior:**
- [ ] Page shows FlowSteps with "Deploy" step highlighted
- [ ] Deployment status displays correctly
- [ ] Status updates in real-time
- [ ] Error handling for failed deployments
- [ ] Success shows deployment URL

---

## 🎨 Palette Compliance Check

### Color Verification
**Primary Colors:**
- [ ] Gold: `#D4AF37`, `#B4891E` (buttons, accents)
- [ ] Beige: `#FBF9F4`, `#F8F4ED`, `#F5F0E8` (backgrounds)
- [ ] Silver: `#C0C7D0`, `#E5E9EF` (borders, secondary)
- [ ] Text: `#1F2937` (primary), `#6B7280` (muted)

**Component Checks:**
- [ ] All buttons use gold gradient with proper hover states
- [ ] Cards have beige/silver borders and backgrounds
- [ ] Focus rings are gold (`#F7DC6F`)
- [ ] Links use gold hover effects
- [ ] Empty states use gold accents

### Typography
- [ ] Headings use proper font weights and sizes
- [ ] Body text is readable with good contrast
- [ ] Code blocks have proper styling
- [ ] Responsive text scaling works

---

## 🔧 Error Simulation Tests

### Network Errors
1. **Disconnect internet** → Submit idea
   - [ ] Shows user-friendly error message
   - [ ] Retry option available
   - [ ] No console errors

2. **Slow network** → Generate PRD
   - [ ] Loading state shows
   - [ ] Timeout handled gracefully
   - [ ] User can retry

### Validation Errors
1. **Empty idea submission**
   - [ ] Shows "Please describe your idea with at least 10 characters"
   - [ ] Button remains disabled

2. **Invalid project ID**
   - [ ] Shows "Project not found" empty state
   - [ ] Provides "Start New Project" action

### API Errors
1. **Rate limit exceeded**
   - [ ] Shows rate limit message with retry time
   - [ ] User can wait and retry

2. **Server error (500)**
   - [ ] Shows generic error message
   - [ ] Suggests trying again

---

## 🎭 Mock Mode Path

### Enable Mock Mode
```bash
# Set environment variable
NEXT_PUBLIC_MOCK_AI=true
```

### Expected Behavior
- [ ] All API calls return mock data instantly
- [ ] PRD content includes persona-specific sections
- [ ] UX content includes job-specific considerations
- [ ] No actual API calls made
- [ ] Mock data is realistic and helpful

### Mock Data Verification
- [ ] PRD includes "Solopreneur Focus" section when persona is Solopreneur
- [ ] UX includes "MVP Launch UX" section when job is Launch MVP
- [ ] Content is well-formatted and professional
- [ ] All sections present (Executive Summary, Problem Statement, etc.)

---

## 💰 Pricing CTA Test

### Pricing Page
**Path:** `/pricing`

**Expected Behavior:**
- [ ] Three pricing tiers displayed (Free, Pro, Founder)
- [ ] "Most Popular" badge on Pro tier
- [ ] CTA buttons work (show demo alert)
- [ ] FAQ section answers common questions
- [ ] Responsive design works on mobile

### CTA Click Tracking
1. **Click "Get Pro" button**
   - [ ] Shows demo alert
   - [ ] Telemetry counter increments
   - [ ] No network calls made

2. **Check telemetry in settings**
   - [ ] Go to `/settings`
   - [ ] View "Usage Analytics" section
   - [ ] See "pricing_cta_clicked" counter
   - [ ] See "tier_pro_selected" counter

---

## 📊 Insights Dashboard Test

### Dashboard Page
**Path:** `/dashboard`

**Expected Behavior:**
- [ ] Shows project count and completion rate
- [ ] Displays average time metrics
- [ ] Recent projects list with status
- [ ] Project timeline with duration data
- [ ] Empty state if no projects

### Data Verification
1. **Create 2-3 test projects**
2. **Check insights update**
   - [ ] Total projects count increases
   - [ ] Time metrics show realistic values
   - [ ] Completion rate calculates correctly

---

## 🔄 Export/Import Test

### Export Tests
1. **PRD Export**
   - [ ] Markdown download works
   - [ ] PDF opens print dialog
   - [ ] Filename includes project name

2. **UX Export**
   - [ ] Markdown download works
   - [ ] PDF opens print dialog
   - [ ] Filename includes project name

3. **Project Export**
   - [ ] JSON download works
   - [ ] File contains all project data
   - [ ] Includes LLM metadata

### Import Tests
1. **Valid Project Import**
   - [ ] Drag and drop JSON file
   - [ ] Success message shows
   - [ ] Redirects to project page
   - [ ] All data preserved

2. **Invalid File Import**
   - [ ] Upload non-JSON file
   - [ ] Error message shows
   - [ ] User can try again

3. **Malformed JSON Import**
   - [ ] Upload invalid JSON
   - [ - ] Error message shows
   - [ ] User can try again

---

## 🏗️ BuildInfo Verification

### Post-Deploy Check
1. **Check BuildInfo badge** (if enabled)
   - [ ] Shows environment (production/staging)
   - [ ] Shows commit SHA
   - [ ] Shows build timestamp
   - [ ] Dismissible with flag

2. **Verify deployment**
   - [ ] App loads without errors
   - [ ] All routes accessible
   - [ ] No console errors
   - [ ] Performance is acceptable

---

## 🌐 Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Responsive design works

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

---

## 🔧 Environment Setup

### Required Environment Variables
```bash
# LLM Configuration
LLM_PROVIDER=anthropic  # or openai
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
OPENAI_MODEL=gpt-4
LLM_TIMEOUT_MS=30000

# Feature Flags
NEXT_PUBLIC_MOCK_AI=false
NEXT_PUBLIC_SHOW_BUILD_INFO=true
NEXT_PUBLIC_SHOW_PRICING=true
NEXT_PUBLIC_SHOW_EXPORTS=true
NEXT_PUBLIC_SHOW_INSIGHTS=true
NEXT_PUBLIC_SHOW_ONBOARDING=true
NEXT_PUBLIC_SHOW_IMPORT=true
NEXT_PUBLIC_SHOW_TELEMETRY=true
NEXT_PUBLIC_SHOW_FLOW_STEPS=true
NEXT_PUBLIC_SHOW_EMPTY_STATES=true
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run build test
npm run build

# Run linting
npm run lint
```

---

## 🚨 Common Issues & Solutions

### Build Errors
1. **TypeScript errors**
   - Check all imports are correct
   - Verify type definitions
   - Run `npm run build` locally

2. **ESLint errors**
   - Fix unused variables
   - Remove console.logs
   - Fix accessibility issues

3. **Module not found**
   - Check file paths
   - Verify imports
   - Check case sensitivity

### Runtime Errors
1. **Hydration errors**
   - Check client/server component usage
   - Verify localStorage access
   - Check for SSR issues

2. **API errors**
   - Check environment variables
   - Verify API keys
   - Check rate limits

3. **State management errors**
   - Check localStorage access
   - Verify state updates
   - Check component lifecycle

---

## 📈 Performance Checklist

### Core Web Vitals
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Bundle Size
- [ ] Main bundle < 250KB
- [ ] No large dependencies
- [ ] Code splitting working

### Loading Performance
- [ ] First paint < 1s
- [ ] Interactive < 2s
- [ ] Images optimized

---

## 🔒 Security Checklist

### Data Privacy
- [ ] No PII stored in localStorage
- [ ] API keys not exposed client-side
- [ ] User data stays local

### Input Validation
- [ ] All inputs validated
- [ ] XSS prevention
- [ ] CSRF protection

### API Security
- [ ] Rate limiting enabled
- [ ] Input sanitization
- [ ] Error handling secure

---

## ✅ Final Sign-off

### Pre-Deploy Checklist
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security review complete
- [ ] Documentation updated

### Post-Deploy Verification
- [ ] App loads successfully
- [ ] All features working
- [ ] No errors in production
- [ ] Monitoring active

---

## 📞 Support & Troubleshooting

### Debug Tools
- Browser DevTools
- Network tab for API calls
- Console for errors
- Application tab for localStorage

### Logs to Check
- Server logs for API errors
- Browser console for client errors
- Network requests for failures

### Common Commands
```bash
# Check build
npm run build

# Run linting
npm run lint

# Check types
npx tsc --noEmit

# Start dev server
npm run dev
```

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Development Team