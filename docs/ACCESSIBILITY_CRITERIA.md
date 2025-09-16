# Accessibility Criteria (WCAG AA)

## Color Contrast Standards

### Text Contrast Requirements
- [ ] **Normal Text**: 4.5:1 minimum contrast ratio
- [ ] **Large Text** (18pt+ or 14pt+ bold): 3:1 minimum contrast ratio
- [ ] **UI Components**: 3:1 minimum for borders, icons, and controls
- [ ] **Focus Indicators**: 3:1 minimum against adjacent colors

### Brand Palette Compliance
- [ ] **Primary Text** (#8B6914 on #FBF9F4): ✓ 7.2:1 ratio
- [ ] **Secondary Text** (#8B6914/70 on #FBF9F4): Test required
- [ ] **Gold Buttons** (#D4AF37 text on white): Test required
- [ ] **Error Text** (red variants): Test required
- [ ] **Success Text** (green variants): Test required

### Testing Tools
- [ ] **WebAIM Contrast Checker**: Verify all color combinations
- [ ] **Lighthouse Accessibility**: Score >95%
- [ ] **aXe DevTools**: Zero violations
- [ ] **Manual Testing**: Simulate color blindness

## Focus Management

### Visible Focus Indicators
- [ ] **All Interactive Elements**: Visible focus ring (gold #D4AF37)
- [ ] **Focus Ring Thickness**: Minimum 2px
- [ ] **Focus Ring Style**: Consistent across components
- [ ] **Focus Order**: Logical tab sequence
- [ ] **Focus Trap**: Modal dialogs capture focus

### Focus Implementation
- [ ] **Button Components**: Built-in focus styles
- [ ] **Form Inputs**: Clear focus indicators
- [ ] **Links**: Underline + focus ring
- [ ] **Custom Controls**: Explicit focus management
- [ ] **Skip Links**: Available for main content

### Testing Checklist
- [ ] **Tab Navigation**: All elements reachable
- [ ] **Shift+Tab**: Reverse navigation works
- [ ] **Focus Visible**: No invisible focus states
- [ ] **Focus Trapping**: Modal dialogs work correctly
- [ ] **Focus Restoration**: Return to trigger elements

## Keyboard Operability

### Navigation Requirements
- [ ] **Tab Key**: Moves forward through controls
- [ ] **Shift+Tab**: Moves backward through controls
- [ ] **Enter**: Activates buttons and links
- [ ] **Space**: Activates buttons, toggles checkboxes
- [ ] **Arrow Keys**: Navigate within components (radio groups, menus)

### Component-Specific Controls
- [ ] **Buttons**: Enter/Space activation
- [ ] **Links**: Enter activation
- [ ] **Form Inputs**: Standard input behavior
- [ ] **Radio Groups**: Arrow key navigation
- [ ] **Checkboxes**: Space toggle
- [ ] **Dropdowns**: Enter to open, Arrow to navigate, Escape to close
- [ ] **Modals**: Escape to close, focus trapping

### Testing Protocol
- [ ] **Unplug Mouse**: Complete all tasks keyboard-only
- [ ] **Screen Reader**: Test with NVDA/VoiceOver/JAWS
- [ ] **Tab Order**: Logical flow through interface
- [ ] **Keyboard Shortcuts**: No conflicts with browser/AT
- [ ] **Mobile**: External keyboard support

## Semantic Labels & ARIA

### Form Labels
- [ ] **Every Input**: Associated `<label>` or `aria-label`
- [ ] **Required Fields**: `aria-required="true"`
- [ ] **Error States**: `aria-invalid="true"` + `aria-describedby`
- [ ] **Field Groups**: `<fieldset>` with `<legend>`
- [ ] **Help Text**: Connected via `aria-describedby`

### Button Labels
- [ ] **Icon Buttons**: `aria-label` describing action
- [ ] **Button Text**: Clear, action-oriented language
- [ ] **Loading States**: `aria-busy="true"` when processing
- [ ] **Toggle Buttons**: `aria-pressed` state
- [ ] **Disabled Buttons**: `disabled` attribute

### Interactive Elements
- [ ] **Links**: Descriptive text (avoid "click here")
- [ ] **Navigation**: `<nav>` landmark with `aria-label`
- [ ] **Main Content**: `<main>` landmark
- [ ] **Regions**: Appropriate landmarks (`header`, `footer`, `aside`)
- [ ] **Lists**: Proper `<ul>`, `<ol>`, `<li>` structure

### ARIA Patterns
- [ ] **Live Regions**: `aria-live="polite"` for status updates
- [ ] **Modal Dialogs**: `role="dialog"`, `aria-modal="true"`
- [ ] **Tabs**: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- [ ] **Accordions**: `aria-expanded` states
- [ ] **Dropdowns**: `aria-haspopup`, `aria-expanded`

## Testing Procedures

### Automated Testing
```bash
# Lighthouse accessibility audit
npm run build
npm run lighthouse

# aXe accessibility testing
npm run test:a11y

# Pa11y command line testing
pa11y --reporter json --level WCAG2AA https://localhost:3000
```

### Manual Testing Steps

#### Screen Reader Testing
1. **NVDA (Windows)**
   - [ ] Install NVDA (free)
   - [ ] Navigate entire application
   - [ ] Test forms and interactions
   - [ ] Verify announcements

2. **VoiceOver (macOS)**
   - [ ] Enable VoiceOver (Cmd+F5)
   - [ ] Test rotor navigation
   - [ ] Verify heading structure
   - [ ] Test landmark navigation

3. **JAWS (Windows)**
   - [ ] Test with JAWS if available
   - [ ] Focus on complex interactions
   - [ ] Verify virtual cursor behavior

#### Keyboard Testing
1. **Basic Navigation**
   - [ ] Tab through entire interface
   - [ ] Test all interactive elements
   - [ ] Verify focus is always visible
   - [ ] Check tab order logic

2. **Complex Interactions**
   - [ ] Modal dialog behavior
   - [ ] Form submission and validation
   - [ ] Dynamic content updates
   - [ ] Error handling and recovery

#### Visual Testing
1. **Zoom Testing**
   - [ ] 200% zoom: All content accessible
   - [ ] 400% zoom: No horizontal scrolling
   - [ ] Text remains readable
   - [ ] Controls remain operable

2. **Color Testing**
   - [ ] Simulate color blindness
   - [ ] Remove color entirely (grayscale)
   - [ ] Verify information isn't color-dependent
   - [ ] Test in high contrast mode

## Component Checklist

### Button Component
- [ ] **Focus**: Visible focus ring
- [ ] **Labels**: Clear, descriptive text
- [ ] **States**: Normal, hover, focus, active, disabled
- [ ] **Loading**: `aria-busy` when processing
- [ ] **Icons**: `aria-label` for icon-only buttons

### Input Component
- [ ] **Labels**: Associated label element
- [ ] **Validation**: Error states with `aria-invalid`
- [ ] **Help Text**: Connected via `aria-describedby`
- [ ] **Required**: `aria-required` attribute
- [ ] **Autocomplete**: Appropriate `autocomplete` values

### Card Component
- [ ] **Headings**: Proper heading hierarchy
- [ ] **Links**: Descriptive link text
- [ ] **Images**: Alt text for meaningful images
- [ ] **Actions**: Clear button/link purposes
- [ ] **Content**: Logical reading order

### Modal Component
- [ ] **Role**: `role="dialog"`
- [ ] **Modal**: `aria-modal="true"`
- [ ] **Focus**: Trapped within modal
- [ ] **Labels**: `aria-labelledby` for title
- [ ] **Escape**: Closes on Escape key

### Navigation Component
- [ ] **Landmark**: `<nav>` with `aria-label`
- [ ] **Current**: `aria-current="page"` for active link
- [ ] **Lists**: Proper list structure
- [ ] **Mobile**: Hamburger menu accessibility
- [ ] **Skip Link**: Skip to main content option

## Success Criteria

### Compliance Targets
- [ ] **WCAG AA**: 100% compliance with Level AA criteria
- [ ] **Lighthouse**: >95% accessibility score
- [ ] **aXe**: Zero violations
- [ ] **Manual Testing**: All workflows completable via keyboard + screen reader

### User Experience Goals
- [ ] **Efficiency**: AT users complete tasks in similar time
- [ ] **Independence**: No assistance required
- [ ] **Satisfaction**: Positive feedback from accessibility testing
- [ ] **Error Recovery**: Clear paths to fix mistakes

### Ongoing Maintenance
- [ ] **CI Integration**: Automated a11y testing in pipeline
- [ ] **Team Training**: Developers trained on accessibility
- [ ] **Design System**: Accessible components by default
- [ ] **User Testing**: Regular testing with disabled users
