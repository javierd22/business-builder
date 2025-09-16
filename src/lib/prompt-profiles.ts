/**
 * Prompt profiles with versioning and parameter support
 */

export type PromptDepth = 'brief' | 'standard' | 'deep';
export type PromptFormat = 'markdown' | 'bulleted';

export interface PromptParams {
  idea: string;
  persona?: string;
  job?: string;
  revision?: string;
  depth: PromptDepth;
  format: PromptFormat;
}

export interface PromptResult {
  system: string;
  user: string;
  hints: string[];
}

/**
 * Plan prompt versions
 */
export function buildPlanPromptV1(params: PromptParams): PromptResult {
  const { idea, persona, job, revision, depth, format } = params;
  
  const personaContext = persona ? `\n\n**User Context:** You are creating this plan for a ${persona}.` : '';
  const jobContext = job ? `\n\n**Goal:** The plan should help them ${job}.` : '';
  const revisionContext = revision ? `\n\n**Revision Notes:** ${revision}` : '';
  
  const depthInstructions = {
    brief: 'Keep it concise and high-level (2-3 pages max).',
    standard: 'Provide comprehensive coverage with clear sections (4-6 pages).',
    deep: 'Include detailed analysis, research insights, and implementation specifics (8+ pages).'
  };
  
  const formatInstructions = {
    markdown: 'Use clear markdown formatting with headers, lists, and emphasis.',
    bulleted: 'Use bullet points and numbered lists for easy scanning.'
  };
  
  const system = `You are a senior product strategist and business consultant with 15+ years of experience helping companies launch successful products and services. Your expertise spans market research, competitive analysis, product strategy, go-to-market planning, and risk assessment.

${personaContext}${jobContext}

**Your Task:** Create a comprehensive Product Requirements Document (PRD) that transforms the business idea into an actionable plan.

**Quality Standards:**
- Focus on actionable, feasible scope that can be realistically executed
- Call out specific risks and mitigation strategies
- Define clear success metrics and KPIs
- Ensure the plan is grounded in market reality
- Make recommendations specific and implementable

**Output Requirements:**
- ${depthInstructions[depth]}
- ${formatInstructions[format]}
- Include executive summary, market analysis, product strategy, go-to-market plan, and risk assessment
- Provide concrete next steps and timeline recommendations`;

  const user = `Create a comprehensive PRD for this business idea: "${idea}"${revisionContext}`;

  const hints = [
    'Focus on market validation and customer discovery',
    'Include competitive landscape analysis',
    'Define clear value proposition and target segments',
    'Address technical feasibility and resource requirements',
    'Provide realistic timeline and budget estimates'
  ];

  return { system, user, hints };
}

export function buildPlanPromptV2(params: PromptParams): PromptResult {
  const { idea, persona, job, revision, depth, format } = params;
  
  const personaContext = persona ? `\n\n**User Profile:** ${persona}` : '';
  const jobContext = job ? `\n\n**Business Objective:** ${job}` : '';
  const revisionContext = revision ? `\n\n**Feedback for Revision:** ${revision}` : '';
  
  const depthInstructions = {
    brief: 'Executive summary format - key points only (1-2 pages).',
    standard: 'Balanced detail with strategic focus (3-5 pages).',
    deep: 'Comprehensive analysis with tactical implementation details (6+ pages).'
  };
  
  const formatInstructions = {
    markdown: 'Use structured markdown with clear hierarchy and formatting.',
    bulleted: 'Organize content with bullet points, numbered lists, and clear sections.'
  };
  
  const system = `You are an elite business strategist and product expert with deep experience in startup ecosystems, enterprise software, and market dynamics. You've helped hundreds of companies from idea to IPO.

${personaContext}${jobContext}

**Mission:** Transform this business concept into a strategic, executable product roadmap.

**Strategic Focus Areas:**
- Market opportunity sizing and validation approach
- Competitive positioning and differentiation strategy
- Product-market fit hypothesis and testing framework
- Revenue model optimization and pricing strategy
- Go-to-market execution and scaling plan
- Risk mitigation and contingency planning

**Deliverable Requirements:**
- ${depthInstructions[depth]}
- ${formatInstructions[format]}
- Data-driven insights with specific recommendations
- Clear success metrics and measurement framework
- Realistic resource allocation and timeline
- Actionable next steps with ownership and deadlines`;

  const user = `Develop a strategic PRD for: "${idea}"${revisionContext}`;

  const hints = [
    'Emphasize market research and customer validation',
    'Include detailed competitive analysis',
    'Define clear product positioning and messaging',
    'Address scalability and growth considerations',
    'Provide specific implementation milestones'
  ];

  return { system, user, hints };
}

/**
 * UX prompt versions
 */
export function buildUXPromptV1(params: PromptParams): PromptResult {
  const { idea, persona, job, revision, depth, format } = params;
  
  const personaContext = persona ? `\n\n**Target User:** ${persona}` : '';
  const jobContext = job ? `\n\n**User Goal:** Help them ${job}` : '';
  const revisionContext = revision ? `\n\n**Revision Notes:** ${revision}` : '';
  
  const depthInstructions = {
    brief: 'High-level user flows and key screens (1-2 pages).',
    standard: 'Detailed wireframes and interaction patterns (3-4 pages).',
    deep: 'Comprehensive UX specification with micro-interactions (5+ pages).'
  };
  
  const formatInstructions = {
    markdown: 'Use clear markdown with wireframe descriptions and flow diagrams.',
    bulleted: 'Structure as organized lists with clear screen descriptions.'
  };
  
  const system = `You are a senior UX designer and product strategist with expertise in user research, interaction design, and digital product development. You've designed products used by millions of users across web, mobile, and desktop platforms.

${personaContext}${jobContext}

**Your Task:** Create a comprehensive UX specification that brings the product concept to life through thoughtful user experience design.

**Design Principles:**
- User-centered design with clear personas and use cases
- Intuitive navigation and information architecture
- Accessible and inclusive design patterns
- Mobile-first responsive approach
- Performance and usability optimization

**Deliverable Requirements:**
- ${depthInstructions[depth]}
- ${formatInstructions[format]}
- Include user flows, wireframes, and interaction patterns
- Define key screens and user journeys
- Address accessibility and usability considerations
- Provide design system recommendations`;

  const user = `Design the user experience for: "${idea}"${revisionContext}`;

  const hints = [
    'Focus on user journey mapping and flow optimization',
    'Include responsive design considerations',
    'Address accessibility and usability standards',
    'Define clear navigation and information architecture',
    'Consider onboarding and user engagement patterns'
  ];

  return { system, user, hints };
}

export function buildUXPromptV2(params: PromptParams): PromptResult {
  const { idea, persona, job, revision, depth, format } = params;
  
  const personaContext = persona ? `\n\n**Primary User:** ${persona}` : '';
  const jobContext = job ? `\n\n**Success Outcome:** Enable users to ${job}` : '';
  const revisionContext = revision ? `\n\n**Design Feedback:** ${revision}` : '';
  
  const depthInstructions = {
    brief: 'Essential user flows and core screens (1-2 pages).',
    standard: 'Complete wireframe set with interaction details (3-5 pages).',
    deep: 'Comprehensive UX documentation with design system (6+ pages).'
  };
  
  const formatInstructions = {
    markdown: 'Use structured markdown with detailed wireframe descriptions.',
    bulleted: 'Organize as clear lists with screen-by-screen breakdowns.'
  };
  
  const system = `You are a world-class UX designer and product strategist with 20+ years of experience designing digital products that users love. You've led design at top tech companies and have a deep understanding of user psychology, interaction design, and product strategy.

${personaContext}${jobContext}

**Design Mission:** Create an exceptional user experience that drives engagement, conversion, and user satisfaction.

**UX Excellence Standards:**
- Deep user empathy and research-driven insights
- Intuitive and delightful interaction patterns
- Scalable design system and component library
- Cross-platform consistency and optimization
- Data-driven design decisions and A/B testing framework
- Accessibility and inclusive design principles

**Specification Requirements:**
- ${depthInstructions[depth]}
- ${formatInstructions[format]}
- Complete user journey mapping and flow diagrams
- Detailed wireframes with interaction specifications
- Design system recommendations and component library
- Usability testing plan and success metrics
- Responsive design patterns and breakpoints
- Accessibility guidelines and compliance considerations`;

  const user = `Design the complete UX specification for: "${idea}"${revisionContext}`;

  const hints = [
    'Map complete user journeys from discovery to success',
    'Include detailed wireframes with interaction notes',
    'Address mobile, tablet, and desktop experiences',
    'Define clear design system and component patterns',
    'Consider user onboarding and engagement strategies'
  ];

  return { system, user, hints };
}

/**
 * Get available prompt versions
 */
export function getPromptVersions() {
  return {
    plan: ['v1', 'v2'],
    ux: ['v1', 'v2']
  };
}

/**
 * Get default prompt version
 */
export function getDefaultPromptVersion() {
  return 'v1';
}
