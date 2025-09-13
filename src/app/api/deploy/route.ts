import { NextResponse } from "next/server";

export async function POST() {
  const hookUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL;

  if (!hookUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: `Hook failed: ${res.status} ${res.statusText}`,
          body: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Network error calling deploy hook", detail },
      { status: 500 }
    );
  }
}
