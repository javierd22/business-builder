/**
 * JTBD-aware prompt templates for persona-specific content generation
 */

export interface PromptContext {
  idea: string;
  persona?: string;
  job?: string;
}

/**
 * Build context string for persona and job
 */
export function buildContextString(persona?: string, job?: string): string {
  if (!persona && !job) {
    return "";
  }

  const parts: string[] = [];
  
  if (persona) {
    parts.push(`You are working with a ${persona.toLowerCase()}`);
  }
  
  if (job) {
    parts.push(`whose primary goal is to ${job.toLowerCase()}`);
  }

  return parts.length > 0 ? `\n\nContext: ${parts.join(" ")}.` : "";
}

/**
 * Build PRD prompt with persona and job context
 */
export function buildPRDPrompt(context: PromptContext): string {
  const basePrompt = `You are a senior product strategist. Generate a comprehensive Product Requirements Document (PRD) for the given business idea.

Return the PRD as structured markdown with these sections:
- Executive Summary
- Problem Statement
- Target Audience
- Value Proposition
- Core Features (5-7 key features)
- Success Metrics
- Implementation Timeline
- Risk Assessment

Be concise but thorough. Focus on business value and user needs.`;

  const contextString = buildContextString(context.persona, context.job);
  
  if (contextString) {
    return `${basePrompt}${contextString}

Tailor the PRD specifically for this persona and their goals. Consider their unique challenges, resources, and success criteria.`;
  }

  return basePrompt;
}

/**
 * Build UX prompt with persona and job context
 */
export function buildUXPrompt(context: PromptContext): string {
  const basePrompt = `You are a senior UX designer. Generate a comprehensive UX specification based on the provided PRD.

Return the UX spec as structured markdown with these sections:
- Design Principles
- Information Architecture
- Primary User Flows
- Screen Descriptions (5-7 key screens)
- Interaction Patterns
- Accessibility Considerations
- Edge Cases and Error States

Be detailed but practical. Focus on user experience and usability.`;

  const contextString = buildContextString(context.persona, context.job);
  
  if (contextString) {
    return `${basePrompt}${contextString}

Design the UX specifically for this persona and their goals. Consider their workflow, technical comfort level, and success metrics.`;
  }

  return basePrompt;
}

/**
 * Build mock PRD with persona and job context
 */
export function buildMockPRD(context: PromptContext): string {
  const contextString = buildContextString(context.persona, context.job);
  
  let personaSpecificContent = "";
  if (context.persona) {
    switch (context.persona.toLowerCase()) {
      case "solopreneur":
        personaSpecificContent = "\n\n**Solopreneur Focus:** This PRD emphasizes rapid iteration, minimal overhead, and direct user feedback. Features are prioritized for maximum impact with minimal resources.";
        break;
      case "smb owner":
        personaSpecificContent = "\n\n**SMB Owner Focus:** This PRD balances growth potential with operational efficiency. Features support team collaboration and scalable business processes.";
        break;
      case "agency":
        personaSpecificContent = "\n\n**Agency Focus:** This PRD emphasizes client management, project scalability, and service delivery excellence. Features support multiple client workflows.";
        break;
      case "pm/founder":
        personaSpecificContent = "\n\n**PM/Founder Focus:** This PRD emphasizes market validation, user research, and product-market fit. Features are data-driven and user-centric.";
        break;
    }
  }

  let jobSpecificContent = "";
  if (context.job) {
    switch (context.job.toLowerCase()) {
      case "launch mvp":
        jobSpecificContent = "\n\n**MVP Launch Strategy:** Prioritized features for rapid market entry with core functionality that validates the business concept.";
        break;
      case "validate market":
        jobSpecificContent = "\n\n**Market Validation Focus:** Features designed to test assumptions, gather user feedback, and prove product-market fit.";
        break;
      case "automate operations":
        jobSpecificContent = "\n\n**Operations Automation:** Features focused on streamlining workflows, reducing manual work, and improving efficiency.";
        break;
      case "create pitch deck":
        jobSpecificContent = "\n\n**Pitch Deck Preparation:** Features and metrics that demonstrate market opportunity, competitive advantage, and growth potential.";
        break;
    }
  }

  return `# Product Requirements Document

## Executive Summary
**Business Idea:** ${context.idea}${contextString}

This document outlines the requirements for developing a comprehensive business solution that addresses specific market needs and user challenges in the target domain.${personaSpecificContent}${jobSpecificContent}

## Problem Statement
The current market lacks a streamlined solution that effectively addresses the core challenges identified in this business domain. Users struggle with fragmented tools and processes that don't integrate well together.

## Target Audience
- **Primary Users:** Business professionals and entrepreneurs
- **Secondary Users:** Stakeholders and decision makers  
- **Market Segment:** Small to medium enterprises

## Value Proposition
- Streamlined workflow integration
- Reduced time-to-market for business initiatives
- Improved user experience and satisfaction
- Cost-effective solution for growing businesses

## Core Features
1. **User Authentication** - Secure login and registration system
2. **Dashboard** - Comprehensive overview with key metrics and insights
3. **Data Management** - Create, read, update, and delete operations
4. **Reporting** - Analytics and insights generation
5. **Mobile Support** - Responsive design for all devices
6. **Integration** - Connect with existing business tools
7. **Notifications** - Real-time updates and alerts

## Success Metrics
- User adoption rate: 80% within first quarter
- System uptime: 99.9% availability
- User satisfaction: 4.5+ star rating
- Time to value: < 30 days for new users

## Implementation Timeline
- **Phase 1 (MVP):** 6-8 weeks
- **Phase 2 (Enhancement):** 4-6 weeks  
- **Phase 3 (Scale):** Ongoing iterations

## Risk Assessment
- **Technical Risk:** Medium - requires integration with multiple systems
- **Market Risk:** Low - clear demand for solution
- **Resource Risk:** Medium - requires skilled development team
- **Timeline Risk:** Low - well-defined scope and requirements`;
}

/**
 * Build mock UX with persona and job context
 */
export function buildMockUX(context: PromptContext): string {
  const contextString = buildContextString(context.persona, context.job);
  
  let personaSpecificContent = "";
  if (context.persona) {
    switch (context.persona.toLowerCase()) {
      case "solopreneur":
        personaSpecificContent = "\n\n**Solopreneur UX Considerations:** Simple, intuitive interface with minimal learning curve. Focus on efficiency and quick task completion.";
        break;
      case "smb owner":
        personaSpecificContent = "\n\n**SMB Owner UX Considerations:** Professional appearance with clear business value. Features that support team collaboration and business growth.";
        break;
      case "agency":
        personaSpecificContent = "\n\n**Agency UX Considerations:** Client-facing interface with white-label capabilities. Features for project management and client communication.";
        break;
      case "pm/founder":
        personaSpecificContent = "\n\n**PM/Founder UX Considerations:** Data-rich interface with analytics and insights. Features for user research and product iteration.";
        break;
    }
  }

  let jobSpecificContent = "";
  if (context.job) {
    switch (context.job.toLowerCase()) {
      case "launch mvp":
        jobSpecificContent = "\n\n**MVP Launch UX:** Streamlined onboarding and core feature access. Minimal viable user experience that validates key functionality.";
        break;
      case "validate market":
        jobSpecificContent = "\n\n**Market Validation UX:** User feedback collection and analytics. Features for testing assumptions and measuring user behavior.";
        break;
      case "automate operations":
        jobSpecificContent = "\n\n**Operations Automation UX:** Workflow visualization and automation controls. Features for process optimization and efficiency monitoring.";
        break;
      case "create pitch deck":
        jobSpecificContent = "\n\n**Pitch Deck UX:** Data visualization and presentation features. Interface elements that support investor communication and business storytelling.";
        break;
    }
  }

  return `# User Experience Design${contextString}

## Design Principles
- **Simplicity:** Clean, intuitive interface design
- **Accessibility:** WCAG 2.1 AA compliance throughout
- **Consistency:** Unified design language and patterns
- **Performance:** Fast loading times and smooth interactions${personaSpecificContent}${jobSpecificContent}

## Information Architecture
- **Primary Navigation:** Dashboard, Projects, Analytics, Settings
- **Secondary Navigation:** User profile, Help, Notifications
- **Content Hierarchy:** Clear information prioritization

## Primary User Flows

### User Onboarding
1. **Landing Page** - Clear value proposition and call-to-action
2. **Registration** - Streamlined 3-step signup process
3. **Dashboard Setup** - Guided tour and initial configuration
4. **First Project** - Template-based project creation

### Core Workflow
1. **Project Creation** - Intuitive project setup wizard
2. **Data Entry** - Form-based data input with validation
3. **Review & Edit** - Real-time preview and editing capabilities
4. **Publish & Share** - Export and sharing options

## Screen Descriptions

### Dashboard
- Overview cards with key metrics
- Recent activity feed
- Quick action buttons
- Navigation sidebar

### Project List
- Grid/list view toggle
- Search and filter controls
- Project status indicators
- Bulk action options

### Project Detail
- Tabbed interface for different views
- Real-time collaboration indicators
- Version history and comments
- Export and sharing controls

### Settings
- User profile management
- Notification preferences
- Integration settings
- Billing and subscription info

## Interaction Patterns
- **Hover States:** Subtle animations and visual feedback
- **Loading States:** Skeleton screens and progress indicators
- **Error Handling:** Clear error messages with recovery actions
- **Success Feedback:** Toast notifications and confirmation dialogs

## Accessibility Considerations
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management and indicators

## Edge Cases and Error States
- **Network Issues:** Offline mode with sync indicators
- **Validation Errors:** Inline error messages with suggestions
- **Empty States:** Helpful illustrations and guidance
- **Permission Errors:** Clear explanation and next steps`;
}
