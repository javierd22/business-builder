import { NextResponse } from "next/server";

export async function GET() {
  // sanity check: visit /api/ux in the browser
  return NextResponse.json({ ok: true, expects: "POST { idea: string }" });
}

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Missing 'idea' string" }, { status: 400 });
    }

    const ux = `# UX Spec (v0)
**Idea:** ${idea}

## Primary Flow
1. Landing → user describes idea
2. System drafts PRD
3. User approves PRD
4. System drafts UX spec
5. Scaffold app + preview
6. Iterate → Launch

## Routes (v0)
- \`/\` — Landing + idea form
- \`/dashboard\` — Projects list
- \`/dashboard/[id]\` — Project details + pipeline
- \`/deploy\` — Preview + next steps

## Entities
- **Project**: { id, name, idea, status, prd, ux, previewUrl }

## Acceptance (happy path)
- Create project → Generate PRD → Generate UX → See both docs and a preview (mock).
`;

    return NextResponse.json({ ux });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
