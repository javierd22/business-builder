import { NextResponse } from "next/server";

/**
 * Generate an ID for logging
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Log server-side errors with request ID
 */
function logError(requestId: string, error: unknown, context: string) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${requestId}] ${context}:`, error instanceof Error ? error.message : error);
}

export async function GET() {
  // sanity check: visit /api/plan in the browser
  return NextResponse.json({ 
    ok: true, 
    expects: "POST { idea: string }",
    returns: "{ prd: string }"
  });
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] [${requestId}] PRD generation request started`);
  
  try {
    const body = await req.json();
    const { idea } = body;
    
    if (!idea || typeof idea !== "string") {
      logError(requestId, "Missing or invalid idea parameter", "Validation");
      return NextResponse.json(
        { message: "Business idea is required" }, 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (idea.trim().length < 10) {
      logError(requestId, `Idea too short: ${idea.length} chars`, "Validation");
      return NextResponse.json(
        { message: "Business idea must be at least 10 characters long" }, 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Generate PRD content
    const prd = `# Product Requirements Document

## Executive Summary
**Business Idea:** ${idea}

## Problem Statement
This document outlines the requirements for developing a business solution that addresses specific market needs and user challenges.

## Target Audience
- **Primary Users:** Business professionals and entrepreneurs
- **Secondary Users:** Stakeholders and investors
- **Market Segment:** Small to medium enterprises and startups

## Core Features & Requirements

### 1. User Management
- Secure user authentication and authorization
- User profile management and preferences
- Role-based access control

### 2. Core Functionality
- **Data Input & Processing:** Efficient handling of user inputs and business data
- **Analytics & Reporting:** Real-time insights and comprehensive reporting
- **Integration Capabilities:** API connections with third-party services
- **Mobile Responsiveness:** Optimized experience across all devices

### 3. Business Logic
- **Workflow Management:** Streamlined business processes
- **Data Validation:** Robust input validation and error handling
- **Performance Optimization:** Fast loading times and efficient operations
- **Security Measures:** Data encryption and privacy compliance

## Technical Requirements

### Frontend
- Modern web framework (React/Vue/Angular)
- Responsive design with mobile-first approach
- Progressive Web App (PWA) capabilities
- Accessibility compliance (WCAG 2.1)

### Backend
- RESTful API architecture
- Database management and optimization
- Scalable cloud infrastructure
- Real-time data processing capabilities

### Infrastructure
- Automated deployment pipeline
- Monitoring and logging systems
- Backup and disaster recovery
- Performance monitoring and alerting

## Success Metrics
- **User Adoption:** Target 1000+ active users within first quarter
- **Performance:** Page load times under 2 seconds
- **Reliability:** 99.9% uptime availability
- **User Satisfaction:** 4.5+ star rating from user feedback

## Implementation Timeline
- **Phase 1 (MVP):** 6-8 weeks - Core functionality and basic UI
- **Phase 2 (Enhancement):** 4-6 weeks - Advanced features and integrations
- **Phase 3 (Scale):** 4-8 weeks - Performance optimization and scaling

## Risk Assessment
- Technical complexity and integration challenges
- Market competition and user acquisition
- Resource allocation and timeline management
- Security and compliance requirements

## Conclusion
This PRD serves as the foundation for developing a comprehensive business solution that meets market demands and user expectations while maintaining technical excellence and scalability.`;

    console.log(`[${timestamp}] [${requestId}] PRD generation completed successfully`);
    
    return NextResponse.json(
      { prd },
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    logError(requestId, error, "Server Error");
    return NextResponse.json(
      { message: "Unable to process your request. Please try again." }, 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}