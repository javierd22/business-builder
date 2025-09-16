import { NextResponse } from "next/server";

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function logError(requestId: string, error: unknown, context: string) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${requestId}] ${context}:`, error instanceof Error ? error.message : error);
}

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    expects: "POST { idea: string }",
    returns: "{ prd: string }"
  }, {
    headers: { "Content-Type": "application/json" }
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

    const prd = `# Product Requirements Document

## Executive Summary
**Business Idea:** ${idea}

## Problem Statement
This document outlines the requirements for developing a business solution that addresses specific market needs and user challenges in the target domain.

## Target Audience
- **Primary Users:** Business professionals and entrepreneurs
- **Secondary Users:** Stakeholders and decision makers
- **Market Segment:** Small to medium enterprises

## Core Features
1. **User Authentication** - Secure login and registration system
2. **Dashboard** - Comprehensive overview with key metrics
3. **Data Management** - Create, read, update, and delete operations
4. **Reporting** - Analytics and insights generation
5. **Mobile Support** - Responsive design for all devices

## Technical Requirements
- **Frontend:** Modern web framework with TypeScript
- **Backend:** RESTful API with robust validation
- **Database:** Scalable data storage solution
- **Security:** Industry-standard encryption and privacy

## Success Metrics
- User adoption rate: 80% within first quarter
- System uptime: 99.9% availability
- User satisfaction: 4.5+ star rating

## Implementation Timeline
- **Phase 1 (MVP):** 6-8 weeks
- **Phase 2 (Enhancement):** 4-6 weeks
- **Phase 3 (Scale):** Ongoing iterations`;

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