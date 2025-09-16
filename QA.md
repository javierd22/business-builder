# Business Builder - QA Checklist

## Full Flow Walkthrough (10 minutes)

### 1. Landing Page
- [ ] Navigate to the deployed app
- [ ] Verify beige background and gold accents are visible
- [ ] Check that navbar shows "Business Builder" with gold dot logo
- [ ] Verify "Start Building" button is gold with proper hover state
- [ ] Test idea input box (should navigate to `/idea` on click)
- [ ] Confirm suggestion chips navigate to `/idea`
- [ ] Verify trust bar shows user avatars with gold borders

### 2. Idea Submission (`/idea`)
- [ ] Enter a business idea (minimum 10 characters)
- [ ] Click "Generate Business Plan"
- [ ] Verify loading state shows "Generating PRD..."
- [ ] Confirm successful navigation to `/plan/review/[projectId]`
- [ ] Check that PRD content is populated

### 3. PRD Review (`/plan/review/[projectId]`)
- [ ] Verify PRD content is displayed in textarea
- [ ] Test editing the PRD content
- [ ] Click "Generate User Experience"
- [ ] Verify loading state shows "Generating UX..."
- [ ] Confirm navigation to `/ux/preview/[projectId]`

### 4. UX Preview (`/ux/preview/[projectId]`)
- [ ] Verify UX content is displayed
- [ ] Check "Ready to Deploy?" information box
- [ ] Click "Deploy App"
- [ ] Verify loading state shows "Deploying App..."
- [ ] Confirm navigation to `/deploy/[projectId]`

### 5. Deployment Status (`/deploy/[projectId]`)
- [ ] Verify deployment status is shown correctly
- [ ] If completed, check "Your Business App is Live!" message
- [ ] Test "View Live App" button (should open in new tab)
- [ ] Verify project navigation buttons work

## Palette Compliance Check

### Gold (#D4AF37)
- [ ] Primary buttons use gold background
- [ ] Logo dot is gold
- [ ] Hero accent word "reality" is gold
- [ ] Suggestion chip hover states show gold borders
- [ ] Focus rings are gold throughout

### Gold Dark (#B4891E)
- [ ] Button hover states use darker gold
- [ ] Active button states are darker gold

### Beige (#F4EDE2)
- [ ] Page backgrounds are beige
- [ ] Error panel backgrounds are beige

### Silver (#C0C7D0) & Silver Light (#E5E9EF)
- [ ] Card borders use silver light
- [ ] Input borders use silver light
- [ ] Loading skeleton uses silver light

### Text Colors
- [ ] Headings use text-DEFAULT (#1F2937)
- [ ] Body text uses text-muted (#6B7280)
- [ ] All text has sufficient contrast

## Error Simulation & Resilience

### Network Error Testing
- [ ] Disconnect internet during PRD generation
- [ ] Verify friendly error panel appears with "We couldn't complete this step"
- [ ] Check "Retry" button works when connection restored
- [ ] Test "Edit Input" button returns to form
- [ ] Verify "Try Sample" button (if mock mode available)

### Validation Testing
- [ ] Submit idea with less than 10 characters
- [ ] Verify validation error appears
- [ ] Test empty form submission
- [ ] Confirm error states are user-friendly

## Mock Mode Testing

### Enable Mock Mode
- [ ] Set `NEXT_PUBLIC_MOCK_AI=true` in environment
- [ ] Verify immediate completion without network calls
- [ ] Check "Using sample content" indicators appear
- [ ] Test full flow completes in under 5 seconds
- [ ] Verify sample PRD and UX content is realistic

## Accessibility Check

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify focus rings are visible (gold)
- [ ] Test Enter/Space activation on buttons
- [ ] Confirm form can be submitted with keyboard

### Screen Reader
- [ ] Check aria-live regions update properly
- [ ] Verify error messages have role="alert"
- [ ] Test form labels are associated correctly
- [ ] Confirm loading states are announced

## Build & Deployment Verification

### BuildInfo Badge
- [ ] Verify badge appears in bottom-right corner
- [ ] Check environment shows correctly (production/preview/development)
- [ ] Confirm SHA updates after each deployment
- [ ] Test badge can be hidden with `NEXT_PUBLIC_SHOW_BUILD_INFO=false`

### Deployment Process
- [ ] Push changes to main branch
- [ ] Monitor Vercel deployment dashboard
- [ ] Verify no build errors or warnings
- [ ] Confirm production URL serves latest version
- [ ] Test hard refresh clears any caching issues

### Post-Deployment
- [ ] Verify BuildInfo SHA matches latest commit
- [ ] Test "Promote to Production" if using preview
- [ ] Confirm all API routes respond correctly
- [ ] Check error boundary works in production

## Browser Compatibility

### Desktop Testing
- [ ] Chrome (latest): Full functionality
- [ ] Safari (latest): All features work
- [ ] Firefox (latest): No layout issues
- [ ] Edge (latest): Complete workflow

### Mobile Testing
- [ ] Mobile Safari: Touch interactions work
- [ ] Chrome Mobile: Responsive layout correct
- [ ] Test portrait and landscape orientations
- [ ] Verify touch targets are minimum 44px

## Performance Check

### Loading Times
- [ ] Initial page load under 3 seconds
- [ ] Route transitions are smooth
- [ ] Images load progressively
- [ ] No layout shift during loading

### Skeleton Loading
- [ ] Loading states appear immediately
- [ ] Skeleton matches actual content layout
- [ ] Smooth transition from skeleton to content
- [ ] No flicker or jumpiness

## Final Acceptance Criteria

### Must Pass All
- [ ] Complete Idea → PRD → UX → Deploy flow works
- [ ] No "Invalid response..." strings anywhere
- [ ] All error messages are friendly and actionable
- [ ] Gold focus rings visible throughout
- [ ] Mock mode provides instant completion
- [ ] BuildInfo updates with each deployment
- [ ] No console errors in production
- [ ] TypeScript compilation is clean
- [ ] ESLint passes with no errors

### Browser Matrix Minimum
- [ ] Chrome ✅
- [ ] Safari ✅  
- [ ] Mobile Safari ✅

---

**QA Completion Time:** ~10 minutes for full walkthrough
**Critical Path:** Landing → Idea → PRD → UX → Deploy
**Pass Criteria:** All checkboxes completed without blocking issues