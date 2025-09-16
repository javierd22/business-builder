# Prompt Styleguide

## PRD Prompt Structure

### System Prompt Template
```
You are a senior product strategist and requirements writer. Your task is to create a comprehensive Product Requirements Document (PRD) from a business idea.

**Context Variables:**
- Persona: {persona} (e.g., "Solopreneur", "SMB Owner", "Agency Founder")
- Job-to-be-Done: {job} (e.g., "Launch MVP", "Validate Market", "Automate Operations")
- Depth: {depth} (e.g., "concise", "detailed", "comprehensive")
- Format: {format} (e.g., "markdown", "structured", "narrative")

**Output Requirements:**
- Return ONLY valid Markdown
- No code blocks or formatting metadata
- Include all standard PRD sections
- Tailor language and priorities to the persona and JTBD
```

### User Prompt Assembly
```
Business Idea: {idea}

{revision_context}

Create a {depth} PRD in {format} format, optimized for a {persona} who wants to {job}.

Focus on practical implementation and clear acceptance criteria.
```

### Revision Context
```
**Previous Version Issues:**
{revision_feedback}

**Requested Changes:**
- Address the feedback above
- Maintain existing structure
- Enhance sections that were unclear
```

## UX Prompt Structure

### System Prompt Template
```
You are a senior UX designer and interaction architect. Your task is to create detailed user experience specifications from a Product Requirements Document.

**Context Variables:**
- Persona: {persona}
- Job-to-be-Done: {job}
- Depth: {depth} (wireframe level vs. detailed specifications)
- Format: {format} (narrative vs. structured vs. component-based)

**Output Requirements:**
- Return ONLY valid Markdown
- Include user flows, wireframes (text descriptions), and interaction specifications
- Consider accessibility and mobile responsiveness
- Align with modern UX best practices
```

### User Prompt Assembly
```
Product Requirements Document:
{prd_content}

{revision_context}

Create {depth} UX specifications in {format} format for a {persona} who wants to {job}.

Include user flows, key screens, and interaction patterns. Focus on usability and conversion.
```

## Prompt Parameters

### Temperature Settings
- **Conservative (0.3)**: Consistent, predictable output for established patterns
- **Balanced (0.7)**: Creative but grounded solutions (default)
- **Creative (0.9)**: Innovative approaches for unique challenges

### Depth Levels
- **Concise**: Essential information only, 1-2 pages
- **Detailed**: Comprehensive coverage, 3-5 pages (default)
- **Comprehensive**: Exhaustive documentation, 5+ pages

### Format Options
- **Markdown**: Standard Markdown with headers and lists (default)
- **Structured**: Formal sections with consistent formatting
- **Narrative**: Flowing prose with embedded structure
- **Component**: Modular sections that can stand alone

## Content Guidelines

### PRD Requirements
- [ ] **Problem Statement**: Clear problem definition
- [ ] **Target Users**: Specific user personas and use cases
- [ ] **Success Metrics**: Measurable outcomes and KPIs
- [ ] **Functional Requirements**: Detailed feature specifications
- [ ] **Non-Functional Requirements**: Performance, security, scalability
- [ ] **User Stories**: Acceptance criteria in user story format
- [ ] **Technical Considerations**: Implementation constraints and dependencies
- [ ] **Risks & Assumptions**: Known risks and key assumptions

### UX Requirements
- [ ] **User Research**: Persona insights and behavioral patterns
- [ ] **Information Architecture**: Site map and content organization
- [ ] **User Flows**: Step-by-step interaction paths
- [ ] **Wireframes**: Screen layouts and component placement (text descriptions)
- [ ] **Interaction Design**: Micro-interactions and state changes
- [ ] **Responsive Design**: Mobile, tablet, desktop considerations
- [ ] **Accessibility**: WCAG compliance and inclusive design
- [ ] **Design System**: Component patterns and style guidelines

## Quality Constraints

### PRD Quality Gates
- [ ] **Clarity**: Requirements are unambiguous and testable
- [ ] **Completeness**: All necessary sections included
- [ ] **Consistency**: Terminology and structure aligned throughout
- [ ] **Feasibility**: Technical requirements are realistic
- [ ] **Measurability**: Success criteria are quantifiable

### UX Quality Gates
- [ ] **User-Centered**: Flows prioritize user needs and goals
- [ ] **Accessibility**: Inclusive design principles applied
- [ ] **Responsive**: Works across device sizes
- [ ] **Performance**: Considers loading and interaction speed
- [ ] **Conversion**: Optimizes for key user actions

## Tone & Voice

### Professional Characteristics
- **Clear**: Use plain language, avoid jargon
- **Actionable**: Focus on implementation, not theory
- **Confident**: State requirements definitively
- **Practical**: Consider real-world constraints

### Persona Adaptations
- **Solopreneur**: Emphasize speed, simplicity, cost-effectiveness
- **SMB Owner**: Focus on scalability, efficiency, ROI
- **Agency Founder**: Highlight client value, differentiation, workflow
- **PM/Founder**: Technical depth, strategic alignment, metrics

### JTBD Adaptations
- **Launch MVP**: Rapid validation, core features, market fit
- **Validate Market**: User feedback, analytics, iteration
- **Automate Operations**: Efficiency, integration, scalability
- **Pitch Deck**: Investor appeal, market opportunity, vision

## Common Pitfalls to Avoid

### PRD Pitfalls
- [ ] **Vague Requirements**: "User-friendly interface" → Specific usability criteria
- [ ] **Technical Jargon**: Avoid implementation details in user stories
- [ ] **Missing Context**: Always include persona and JTBD context
- [ ] **Unrealistic Scope**: Consider MVP constraints and resource limits
- [ ] **Poor Structure**: Follow standard PRD section organization

### UX Pitfalls
- [ ] **Design-Heavy**: Focus on interaction, not visual design
- [ ] **Desktop-Only**: Always consider mobile-first approach
- [ ] **Accessibility Afterthought**: Integrate a11y from the start
- [ ] **Complex Flows**: Optimize for simplicity and conversion
- [ ] **Inconsistent Patterns**: Maintain design system coherence

## Variable Definitions

### Persona Options
- **Solopreneur**: Individual entrepreneur, limited resources, needs speed
- **SMB Owner**: Small business owner, 5-50 employees, growth focus
- **Agency Founder**: Service provider, client-focused, scalability needs
- **PM/Founder**: Product manager or startup founder, technical background

### Job-to-be-Done Options
- **Launch MVP**: Get to market quickly with core features
- **Validate Market**: Test product-market fit with users
- **Automate Operations**: Streamline business processes
- **Pitch Deck**: Secure funding or partnerships

### Depth Guidelines
- **Concise**: 1-2 pages, essential information only
- **Detailed**: 3-5 pages, comprehensive but focused (default)
- **Comprehensive**: 5+ pages, exhaustive documentation

### Format Specifications
- **Markdown**: Clean headers, lists, emphasis (default)
- **Structured**: Formal business document structure
- **Narrative**: Flowing prose with embedded structure
- **Component**: Modular sections for flexible use

## Evaluation Rubric

### Content Quality (1-5 scale)
1. **Relevance**: Addresses the specific business idea and context
2. **Completeness**: Includes all required sections and information
3. **Clarity**: Easy to understand and actionable
4. **Feasibility**: Realistic given constraints and resources
5. **Alignment**: Matches persona needs and JTBD requirements

### Technical Quality (1-5 scale)
1. **Format Compliance**: Follows requested output format
2. **Structure**: Logical organization and flow
3. **Consistency**: Terminology and style alignment
4. **Length**: Appropriate for requested depth level
5. **Markdown Quality**: Valid syntax and formatting

### Usage Guidelines
- **Target Score**: 4.0+ average across all criteria
- **Minimum Score**: 3.0 for any individual criterion
- **Revision Trigger**: <3.5 average or any 2.0 score
- **Quality Tracking**: Log scores in local research telemetry

## Prompt Version Control

### Version 1.0 (Current)
- **Release Date**: Initial implementation
- **Features**: Basic persona/JTBD integration
- **Performance**: Baseline quality metrics
- **Known Issues**: Limited revision handling

### Version 2.0 (Planned)
- **Enhanced Context**: Better revision integration
- **Industry Templates**: Vertical-specific patterns
- **Quality Feedback**: Automated rubric scoring
- **Advanced Formatting**: Rich markdown features

### Migration Strategy
- **Backward Compatibility**: V1 prompts continue working
- **Gradual Rollout**: Feature flags control version usage
- **A/B Testing**: Compare quality between versions
- **User Choice**: Settings allow version selection
