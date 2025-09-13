"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Project = {
  name: string;
  idea: string;
  prd?: string; // markdown
  ux?: string;  // markdown
  previewUrl?: string;
};

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
      if (!Number.isNaN(id) && arr[id]) setProject(arr[id]);
    } catch {}
  }, [id]);

  if (!project) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <p>Preview not found for ID {idStr}.</p>
      </main>
    );
  }

  const tagline =
    project.idea.length > 120 ? project.idea.slice(0, 117) + "…" : project.idea;

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div className="font-semibold">{project.name}</div>
          <Link href="/dashboard" className="underline text-sm">
            Back to App
          </Link>
        </div>
      </header>

      {/* Hero */}
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
          <Link href="/dashboard" className="rounded border px-5 py-3 font-semibold">
            Learn More
          </Link>
        </div>
      </section>

      {/* Render PRD + UX markdown if present */}
      <section className="mx-auto max-w-5xl px-4 pb-16 grid gap-8 md:grid-cols-2">
        <article className="rounded border bg-white p-5">
          <h2 className="text-xl font-bold mb-3">Product Requirements (PRD)</h2>
          {project.prd ? (
            <div className="text-black text-sm leading-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_*]:max-w-none [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.prd}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600">No PRD yet. Generate it in the project page.</p>
          )}
        </article>

        <article className="rounded border bg-white p-5">
          <h2 className="text-xl font-bold mb-3">UX Spec</h2>
          {project.ux ? (
            <div className="text-black text-sm leading-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_*]:max-w-none [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.ux}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600">No UX spec yet. Generate it in the project page.</p>
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
