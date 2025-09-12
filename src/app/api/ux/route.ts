import { NextResponse } from "next/server";

export async function GET() {
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

## Target Flow
1. Landing → Describe idea
2. Approve PRD
3. Choose template (Marketing / SaaS)
4. Generate repo
5. Deploy preview

## Routes (v0)
- \`/\` — Landing + idea form
- \`/dashboard\` — Projects list
- \`/dashboard/[id]\` — Project details + pipeline
- \`/deploy\` — Preview link + next steps

## Entities
- **Project**: { id, name, idea, status, prd, ux, previewUrl }

## Acceptance
- Create project → Generate PRD → Generate UX → See docs + preview (mock)
`;

    return NextResponse.json({ ux });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
