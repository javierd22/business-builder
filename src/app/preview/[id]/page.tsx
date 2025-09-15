"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TemplateKey = "simple" | "centered" | "split" | "pricing";
type ThemeKey = "light" | "dark";
type AccentKey = "blue" | "violet" | "emerald" | "rose";

type Project = {
  name: string;
  idea: string;
  prd?: string;
  ux?: string;
  selectedTemplate?: TemplateKey;
  theme?: ThemeKey;
  accent?: AccentKey;
};

const ACCENT = {
  blue: {
    solid: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "border-blue-600 text-blue-700 hover:bg-blue-50",
    chip: "text-blue-700 bg-blue-50 border-blue-200",
  },
  violet: {
    solid: "bg-violet-600 hover:bg-violet-700 text-white",
    ghost: "border-violet-600 text-violet-700 hover:bg-violet-50",
    chip: "text-violet-700 bg-violet-50 border-violet-200",
  },
  emerald: {
    solid: "bg-emerald-600 hover:bg-emerald-700 text-white",
    ghost: "border-emerald-600 text-emerald-700 hover:bg-emerald-50",
    chip: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  rose: {
    solid: "bg-rose-600 hover:bg-rose-700 text-white",
    ghost: "border-rose-600 text-rose-700 hover:bg-rose-50",
    chip: "text-rose-700 bg-rose-50 border-rose-200",
  },
} as const;

export default function PreviewPage() {
  const params = useParams();
  const idStr = (params?.id as string) ?? "";
  const id = Number(idStr);

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("projects");
      if (!raw) return;
      const arr = JSON.parse(raw) as Project[];
      if (!Number.isNaN(id) && arr[id]) {
        setProject({
          selectedTemplate: "simple",
          theme: "dark",
          accent: "blue",
          ...arr[id],
        });
      }
    } catch {}
  }, [id]);

  const template = useMemo<TemplateKey>(
    () => project?.selectedTemplate ?? "simple",
    [project?.selectedTemplate]
  );

  const theme = project?.theme ?? "dark";
  const accent = ACCENT[project?.accent ?? "blue"];

  if (!project) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <p>Preview not found for ID {idStr}.</p>
      </main>
    );
  }

  const wrapper =
    theme === "light"
      ? "min-h-screen bg-white text-black"
      : "min-h-screen bg-zinc-950 text-zinc-100";

  const muted =
    theme === "light" ? "text-gray-700" : "text-zinc-300";

  const surface =
    theme === "light" ? "bg-gray-50" : "bg-zinc-900";

  const card =
    theme === "light" ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800";

  const tagline =
    project.idea.length > 120 ? project.idea.slice(0, 117) + "…" : project.idea;

  return (
    <main className={wrapper}>
      <header className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
          <div className="font-semibold">{project.name}</div>
          <Link href="/dashboard" className="underline text-sm">
            Back to App
          </Link>
        </div>
      </header>

      {/* HERO by template */}
      {template === "simple" && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-extrabold">{project.name}</h1>
          <p className={`mt-4 text-lg ${muted}`}>{tagline}</p>
          <div className="mt-8 flex gap-3">
            <Link href="/dashboard" className={`rounded px-5 py-3 font-semibold ${accent.solid}`}>
              Try It Free
            </Link>
            <Link href="/dashboard" className={`rounded border px-5 py-3 font-semibold ${accent.ghost}`}>
              Learn More
            </Link>
          </div>
        </section>
      )}

      {template === "centered" && (
        <section className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="text-5xl font-extrabold">{project.name}</h1>
          <p className={`mt-6 text-lg ${muted}`}>{tagline}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard" className={`rounded px-5 py-3 font-semibold ${accent.solid}`}>
              Get Started
            </Link>
            <Link href="/dashboard" className={`rounded border px-5 py-3 font-semibold ${accent.ghost}`}>
              Docs
            </Link>
          </div>
        </section>
      )}

      {template === "split" && (
        <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold">{project.name}</h1>
            <p className={`mt-4 text-lg ${muted}`}>{tagline}</p>
            <div className="mt-8 flex gap-3">
              <Link href="/dashboard" className={`rounded px-5 py-3 font-semibold ${accent.solid}`}>
                Start Now
              </Link>
              <Link href="/dashboard" className={`rounded border px-5 py-3 font-semibold ${accent.ghost}`}>
                Learn More
              </Link>
            </div>
          </div>
          <div className={`rounded border ${card} aspect-video flex items-center justify-center ${muted}`}>
            Image / Mock
          </div>
        </section>
      )}

      {/* NEW: Pricing template */}
      {template === "pricing" && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold">{project.name}</h1>
            <p className={`mt-4 ${muted}`}>{tagline}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded border px-3 py-1 text-sm
                            bg-transparent
                            border-blue-200 text-blue-700
                            border-violet-200 text-violet-700
                            border-emerald-200 text-emerald-700
                            border-rose-200 text-rose-700">
              {/* The above line includes all color classes so Tailwind sees them */}
              <span className={`rounded border px-2 py-0.5 ${ACCENT[project.accent ?? "blue"].chip}`}>
                New
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: "Starter", price: "$0", desc: "For trying things out", cta: "Get started" },
              { name: "Pro", price: "$19", desc: "For solo builders", cta: "Choose Pro", featured: true },
              { name: "Team", price: "$49", desc: "For small teams", cta: "Choose Team" },
            ].map((t) => (
              <div
                key={t.name}
                className={`rounded border p-6 ${card} ${t.featured ? "ring-1 ring-offset-0 ring-white/10" : ""}`}
              >
                <div className="text-sm opacity-80">{t.name}</div>
                <div className="mt-2 text-3xl font-extrabold">{t.price}/mo</div>
                <p className={`mt-2 ${muted}`}>{t.desc}</p>
                <Link
                  href="/dashboard"
                  className={`mt-6 inline-block rounded px-4 py-2 font-semibold ${accent.solid}`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRD + UX markdown if present */}
      {(project.prd || project.ux) && (
        <section className={`px-4 pb-16 ${surface}`}>
          <div className="mx-auto max-w-6xl">
            {project.prd && (
              <div className="pt-10">
                <h2 className="text-2xl font-bold mb-3">PRD</h2>
                <article className="prose max-w-none prose-invert:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.prd}</ReactMarkdown>
                </article>
              </div>
            )}

            {project.ux && (
              <div className="pt-10">
                <h2 className="text-2xl font-bold mb-3">UX Spec</h2>
                <article className="prose max-w-none prose-invert:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.ux}</ReactMarkdown>
                </article>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl p-4 text-sm opacity-70">
          © {new Date().getFullYear()} {project.name}
        </div>
      </footer>
    </main>
  );
}
