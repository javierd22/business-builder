"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TemplateKey = "classic" | "minimal" | "split" | "centered";

type Project = {
  name: string;
  idea: string;
  prd?: string; // markdown
  ux?: string;  // markdown
  previewUrl?: string;
  previewTemplate?: TemplateKey;
};

export default function PreviewPage() {
  const params = useParams();
  const idStr = (params?.id as string) ?? "";
  const id = Number(idStr);

  const [project, setProject] = useState<Project | null>(null);

  // Load project from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("projects");
      if (!raw) return;
      const arr = JSON.parse(raw) as Project[];
      if (!Number.isNaN(id) && arr[id]) {
        // default template if none set
        const p = { previewTemplate: "classic" as TemplateKey, ...arr[id] };
        setProject(p);
      }
    } catch {
      // ignore
    }
  }, [id]);

  // Save project back
  function saveProject(updated: Project) {
    try {
      const raw = localStorage.getItem("projects");
      const arr = raw ? (JSON.parse(raw) as Project[]) : [];
      arr[id] = updated;
      localStorage.setItem("projects", JSON.stringify(arr));
      setProject(updated);
    } catch {
      // ignore
    }
  }

  const template: TemplateKey = useMemo(
    () => (project?.previewTemplate ?? "classic"),
    [project]
  );

  if (!project) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <p>Preview not found for ID {idStr}.</p>
      </main>
    );
  }

  const tagline =
    project.idea.length > 120 ? project.idea.slice(0, 117) + "…" : project.idea;

  function exportCombinedMarkdown() {
    const name = project.name || "project";
    const prd = project.prd?.trim() || "_No PRD generated yet._";
    const ux = project.ux?.trim() || "_No UX spec generated yet._";

    const content = `# ${name} — Preview

**Idea**  
${project.idea}

---

## Product Requirements (PRD)

${prd}

---

## UX Spec

${ux}
`;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-preview.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setTemplate(t: TemplateKey) {
    if (!project) return;
    saveProject({ ...project, previewTemplate: t });
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between gap-4">
          <div className="font-semibold truncate">{project.name}</div>

          {/* Template Picker */}
          <div className="flex items-center gap-2">
            <label htmlFor="template" className="text-sm text-gray-600">
              Template:
            </label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value as TemplateKey)}
              className="rounded border px-2 py-1 text-sm bg-white"
            >
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="split">Split</option>
              <option value="centered">Centered</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCombinedMarkdown}
              className="rounded border px-3 py-1.5 text-sm font-semibold"
            >
              Export Preview (.md)
            </button>
            <Link href="/dashboard" className="underline text-sm">
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* HERO (varies by template) */}
      {template === "classic" && (
        <section className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-4xl font-extrabold">{project.name}</h1>
          <p className="mt-4 text-lg text-gray-700">{tagline}</p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/dashboard"
              className="rounded bg-black text-white px-5 py-3 font-semibold"
            >
              Try It Free
            </Link>
            <Link
              href="/dashboard"
              className="rounded border px-5 py-3 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </section>
      )}

      {template === "minimal" && (
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-5 text-base text-gray-700">{tagline}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded bg-black text-white px-5 py-3 font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="rounded border px-5 py-3 font-semibold"
            >
              Docs
            </Link>
          </div>
        </section>
      )}

      {template === "split" && (
        <section className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl font-extrabold">{project.name}</h1>
            <p className="mt-4 text-lg text-gray-700">{tagline}</p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/dashboard"
                className="rounded bg-black text-white px-5 py-3 font-semibold"
              >
                Start Now
              </Link>
              <Link
                href="/dashboard"
                className="rounded border px-5 py-3 font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="rounded-xl border aspect-video bg-gray-100 grid place-items-center text-gray-500">
            Media / Screenshot Placeholder
          </div>
        </section>
      )}

      {template === "centered" && (
        <section className="mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-gray-600">
            New • Generated from PRD/UX
          </div>
          <h1 className="mt-6 text-5xl font-extrabold">{project.name}</h1>
          <p className="mt-4 text-lg text-gray-700">{tagline}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded bg-black text-white px-5 py-3 font-semibold"
            >
              Try It
            </Link>
            <Link
              href="/dashboard"
              className="rounded border px-5 py-3 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </section>
      )}

      {/* CONTENT: PRD + UX */}
      <section className="mx-auto max-w-5xl px-4 pb-16 grid gap-8 md:grid-cols-2">
        <article className="rounded border bg-white p-5">
          <h2 className="text-xl font-bold mb-3">Product Requirements (PRD)</h2>
          {project.prd ? (
            <div className="text-black text-sm leading-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_*]:max-w-none [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.prd}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600">
              No PRD yet. Generate it in the project page.
            </p>
          )}
        </article>

        <article className="rounded border bg-white p-5">
          <h2 className="text-xl font-bold mb-3">UX Spec</h2>
          {project.ux ? (
            <div className="text-black text-sm leading-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_*]:max-w-none [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.ux}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600">
              No UX spec yet. Generate it in the project page.
            </p>
          )}
        </article>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl p-4 text-sm text-gray-600">
          © {new Date().getFullYear()} {project.name}
        </div>
      </footer>
    </main>
  );
}
