import { NextResponse } from "next/server";

export async function GET() {
  // sanity check: visit /api/plan in the browser
  return NextResponse.json({ ok: true, expects: "POST { idea: string }" });
}

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Missing 'idea' string" }, { status: 400 });
    }

    const plan = `# PRD (v0)
**Idea:** ${idea}

## Problem
Users need a fast way to turn ideas into testable products.

## Solution
An AI-assisted pipeline that drafts a PRD, UX spec, and scaffolds a preview.

## Target Users
Indie builders, founders, and PMs.

## v0 Features
- Create project (name + idea)
- Generate PRD
- Generate UX
- Export docs (.md)
- Preview link (mock)

## Success
User sees PRD + UX and a preview link within minutes.
`;

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
