# Business Builder - QA Checklist

## Flow Walkthrough

### 1. Idea Submission Flow
- [ ] Visit homepage (`/`)
- [ ] Click "Start Building" button
- [ ] Should navigate to `/idea`
- [ ] Form validation:
  - [ ] Empty idea shows: "Please describe your business idea"
  - [ ] Less than 10 chars shows: "Please provide at least 10 characters..."
- [ ] Submit valid idea (10+ chars)
- [ ] Should show loading state: "Generating PRD..."
- [ ] On success: Navigate to `/plan/review/[projectId]`
- [ ] On error: Show retry button and error message

### 2. PRD Review Flow
- [ ] Page shows project idea and generated PRD
- [ ] PRD is editable in textarea
- [ ] Status indicator shows "Planning Phase"
- [ ] Click "Generate User Experience"
- [ ] Should show loading state: "Generating UX..."
- [ ] On success: Navigate to `/ux/preview/[projectId]`
- [ ] On error: Show retry button and error message

### 3. UX Preview Flow
- [ ] Page shows formatted UX design content
- [ ] Status indicator shows "UX Design Phase"
- [ ] Click "Deploy App"
- [ ] Should show loading state: "Deploying application..."
- [ ] On success: Navigate to `/deploy/[projectId]`
- [ ] On error: Show retry button and error message

### 4. Deploy Status Flow
- [ ] **If deploymentLink exists and status=completed:**
  - [ ] Shows "🎉 Your Business App is Live!"
  - [ ] Shows live URL in green box
  - [ ] "View Live App" button opens in new tab
- [ ] **If status=deploying:**
  - [ ] Shows "🚀 Deployment in Progress"
  - [ ] Shows refresh button
- [ ] **If status=failed:**
  - [ ] Shows "❌ Deployment Failed"
  - [ ] Shows "Try Deploying Again" button
- [ ] **Otherwise:**
  - [ ] Shows "⏳ Deployment Status Unavailable"
  - [ ] Shows "Back to UX Preview" button

## Palette Compliance Checks

### Button Colors
- [ ] Primary buttons: `#D4AF37` background, `#B4891E` hover
- [ ] Secondary buttons: white background, `#E5E9EF` border, `#F4EDE2` hover
- [ ] Ghost buttons: transparent, `#F4EDE2` hover
- [ ] All buttons: `#D4AF37` focus ring

### Input/Textarea Colors
- [ ] Background: white
- [ ] Border: `#E5E9EF`
- [ ] Text: `#1F2937`
- [ ] Placeholder: `#6B7280`
- [ ] Focus ring: `#D4AF37`
- [ ] Disabled background: `#F4EDE2`

### Card Colors
- [ ] Background: white
- [ ] Border: `#E5E9EF`
- [ ] Soft shadow present
- [ ] Rounded corners (xl)

### Text Colors
- [ ] Primary text: `#1F2937`
- [ ] Muted text: `#6B7280`
- [ ] Error text: red variants
- [ ] No blue text anywhere

### Background Colors
- [ ] Page backgrounds: `#F4EDE2` beige
- [ ] No dark/black backgrounds
- [ ] Consistent spacing throughout

## Accessibility Checks

### Tab Order
- [ ] Tab through entire flow in logical order
- [ ] All interactive elements focusable
- [ ] Focus indicators visible (gold rings)
- [ ] Skip links work properly

### Labels and ARIA
- [ ] All form inputs have proper labels
- [ ] Error messages use `role="alert"`
- [ ] Loading states use `aria-live="polite"`
- [ ] Status indicators properly labeled
- [ ] Images have descriptive alt text

### Keyboard Navigation
- [ ] All buttons work with Enter/Space
- [ ] Form submission works with Enter
- [ ] Navigation links work with Enter
- [ ] No keyboard traps

### Screen Reader Support
- [ ] Headings use proper hierarchy (h1 → h2 → h3)
- [ ] Form validation announces errors
- [ ] Loading states announce to screen readers
- [ ] Status changes are announced

## Resilience Checks

### Network Failures
- [ ] Disconnect network, submit idea
- [ ] Should show: "Network error: Please check your internet connection..."
- [ ] Retry button should work when network restored

### Server Errors (500)
- [ ] Mock 500 response from `/api/plan`
- [ ] Should show: "Server error: Our service is temporarily unavailable..."
- [ ] Retry should work after server recovered

### Rate Limiting (429)
- [ ] Mock 429 response
- [ ] Should show: "Too many requests: Please wait a moment..."
- [ ] Retry should work after rate limit cleared

### Validation Errors (400)
- [ ] Should show specific validation error messages
- [ ] Should not retry automatically
- [ ] User can fix input and retry

### Failed JSON Parsing
- [ ] Mock invalid JSON response
- [ ] Should show: "Invalid response from server"
- [ ] Should not crash application

### localStorage Failures
- [ ] Block localStorage access
- [ ] App should still load without crashing
- [ ] Should log errors to console
- [ ] Should return empty arrays/fallbacks

### Missing Project Data
- [ ] Visit `/plan/review/nonexistent-id`
- [ ] Should show "PRD Not Found" error
- [ ] Should provide link back to idea generation
- [ ] Visit `/ux/preview/[id]` without UX data
- [ ] Should show appropriate error and navigation

## Deployment Verification

### BuildInfo Badge
- [ ] Badge appears in bottom-right corner
- [ ] Shows current environment (development/preview/production)
- [ ] Shows short commit SHA (7 chars)
- [ ] Shows branch name
- [ ] Shows author (on larger screens)
- [ ] Shows commit message (on larger screens)
- [ ] Shows render timestamp (on larger screens)
- [ ] Status dot color matches environment:
  - [ ] Green for production
  - [ ] Yellow for preview  
  - [ ] Blue for development

### Environment Variables
- [ ] Set `NEXT_PUBLIC_SHOW_BUILD_INFO=false` in production
- [ ] Badge should disappear
- [ ] Set back to `true` or remove variable
- [ ] Badge should reappear

### Deploy SHA Verification
- [ ] Note current SHA in badge
- [ ] Push commit to main branch
- [ ] Wait for Vercel deployment
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Verify SHA changed to new commit
- [ ] Verify other build info updated

### Cache Busting
- [ ] Hard refresh with DevTools Network tab open
- [ ] Check "Disable cache" in DevTools
- [ ] Reload page
- [ ] Verify fresh content loads
- [ ] Verify `x-vercel-id` header changes across deploys

## Performance Checks

### Loading States
- [ ] All async operations show immediate loading feedback
- [ ] Skeleton screens appear for page loads
- [ ] Buttons show loading spinners during API calls
- [ ] Loading text is descriptive and helpful

### Error Recovery
- [ ] All error states have retry mechanisms
- [ ] Error messages are user-friendly
- [ ] App doesn't crash on unhandled errors
- [ ] Error boundary catches and displays global errors

### Mobile Responsiveness
- [ ] Test on mobile device or DevTools mobile view
- [ ] All text readable without zooming
- [ ] Buttons large enough for touch
- [ ] Forms usable on small screens
- [ ] BuildInfo badge doesn't overlap content

### localStorage Performance
- [ ] No performance issues with large project lists
- [ ] Updates are immediate
- [ ] No memory leaks from repeated operations

## Browser Compatibility

### Modern Browsers
- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work  
- [ ] Safari: All features work
- [ ] Mobile Safari: Touch interactions work
- [ ] Mobile Chrome: All features work

### JavaScript Disabled
- [ ] Basic content still visible
- [ ] Forms show appropriate fallback messages
- [ ] Navigation links still work
- [ ] No broken layouts

## Final Production Checklist

### Code Quality
- [ ] No console errors in production
- [ ] No console warnings in production
- [ ] No TypeScript errors
- [ ] All ESLint rules passing
- [ ] No unused imports/variables

### Content Review
- [ ] All text is professional and accurate
- [ ] No placeholder content remaining
- [ ] All links work correctly
- [ ] Images have proper alt text

### Security
- [ ] No sensitive data in client-side code
- [ ] All API endpoints handle errors gracefully
- [ ] Input validation works on both client and server
- [ ] No XSS vulnerabilities

### SEO & Metadata
- [ ] Page titles are descriptive
- [ ] Meta descriptions present
- [ ] Proper heading hierarchy
- [ ] Semantic HTML structure

---

## Quick Test Commands

```bash
# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Start production server locally
npm start
```

## Emergency Rollback

If issues are found in production:

1. Revert problematic commit: `git revert [commit-sha]`
2. Push to main: `git push origin main`
3. Verify Vercel auto-deploys the revert
4. Check BuildInfo badge shows reverted SHA
5. Test critical paths work correctly
