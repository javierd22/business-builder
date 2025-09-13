"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Project = {
  name: string;
  idea: string;
  prd?: string;
  ux?: string;
  previewUrl?: string;
  stage?: number;
};

const STAGES = ["Clarify", "PRD", "UX", "Build", "Launch"] as const;

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = (params?.id as string) ?? "";
  const idx = Number(idParam);

  const [project, setProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState<"prd" | "ux" | "preview" | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("projects");
      if (!raw) return;
      const arr = JSON.parse(raw) as Project[];
      if (!Number.isNaN(idx) && arr[idx]) {
        setProject({ stage: 0, ...arr[idx] });
      }
    } catch {}
  }, [idx]);

  function saveProject(updated: Project) {
    try {
      const raw = localStorage.getItem("projects");
      const arr = raw ? (JSON.parse(raw) as Project[]) : [];
      arr[idx] = updated;
      localStorage.setItem("projects", JSON.stringify(arr));
      setProject(updated);
    } catch {}
  }

  async function generatePRD() {
    if (!project) return;
    setBusy("prd");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: project.idea }),
      });
      if (!res.ok) {
        const t = await res.text();
        alert(`PRD failed: ${res.status} ${res.statusText}\n${t}`);
        return;
      }
      const data = await res.json();
      saveProject({
        ...project,
        prd: data.plan as string,
        stage: Math.max(project.stage ?? 0, 1),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to generate PRD.");
    } finally {
      setBusy(null);
    }
  }

  async function generateUX() {
    if (!project) return;
    setBusy("ux");
    try {
      const res = await fetch("/api/ux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: project.idea }),
      });
      if (!res.ok) {
        const t = await res.text();
        alert(`UX failed: ${res.status} ${res.statusText}\n${t}`);
        return;
      }
      const data = await res.json();
      saveProject({
        ...project,
        ux: data.ux as string,
        stage: Math.max(project.stage ?? 0, 2),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to generate UX.");
    } finally {
      setBusy(null);
    }
  }

  function generatePreview() {
    if (!project) return;
    setBusy("preview");
    try {
      const previewUrl = `/preview/${idx}`;
      saveProject({
        ...project,
        previewUrl,
        stage: Math.max(project.stage ?? 0, 3),
      });
      router.push(previewUrl);
    } finally {
      setBusy(null);
    }
  }

  function exportDoc(label: "PRD" | "UX", content?: string) {
    if (!content) return;
    const slug = (project?.name || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-${label}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const currentStage = useMemo(() => project?.stage ?? 0, [project]);

  if (!project) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <Link href="/dashboard" className="underline">← Back to Dashboard</Link>
        <p className="mt-6">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 space-y-6">
      <Link href="/dashboard" className="underline">← Back to Dashboard</Link>

      <section>
        <h1 className="mt-4 text-2xl font-bold">Project Details</h1>
        <p className="mt-2 text-gray-400">ID: <code>{idParam}</code></p>
      </section>

      <section className="rounded border bg-gray-50/5 p-4">
        <h2 className="font-semibold">Name</h2>
        <p className="mt-1">{project.name}</p>
      </section>

      <section className="rounded border bg-gray-50/5 p-4">
        <h2 className="font-semibold">Idea</h2>
        <p className="mt-1 whitespace-pre-wrap">{project.idea}</p>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Pipeline</h2>
        <ol className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => (
            <li key={s}
              className={`px-3 py-1 rounded border text-sm ${i <= currentStage ? "bg-white text-black" : "bg-transparent text-white"}`}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-wrap gap-3">
        <button onClick={generatePRD} disabled={busy === "prd"} className="rounded bg-white text-black px-4 py-2 font-semibold disabled:bg-gray-400">
          {busy === "prd" ? "Generating PRD..." : "Generate PRD"}
        </button>

        <button onClick={() => exportDoc("PRD", project.prd)} disabled={!project.prd} className="rounded border px-4 py-2 font-semibold disabled:opacity-50">
          Export PRD (.md)
        </button>

        <button onClick={generateUX} disabled={busy === "ux"} className="rounded bg-white text-black px-4 py-2 font-semibold disabled:bg-gray-400">
          {busy === "ux" ? "Generating UX..." : "Generate UX"}
        </button>

        <button onClick={() => exportDoc("UX", project.ux)} disabled={!project.ux} className="rounded border px-4 py-2 font-semibold disabled:opacity-50">
          Export UX (.md)
        </button>

        <button onClick={generatePreview} disabled={busy === "preview"} className="rounded bg-white text-black px-4 py-2 font-semibold disabled:bg-gray-400">
          {busy === "preview" ? "Creating Preview..." : "Generate Preview"}
        </button>

        {project.previewUrl && (
          <Link href={project.previewUrl} className="rounded border px-4 py-2 font-semibold underline">
            Open Preview →
          </Link>
        )}
      </section>

      {project.prd && (
        <section className="rounded border p-4 bg-white text-black">
          <h2 className="font-semibold">PRD</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{project.prd}</pre>
        </section>
      )}

      {project.ux && (
        <section className="rounded border p-4 bg-white text-black">
          <h2 className="font-semibold">UX Spec</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{project.ux}</pre>
        </section>
      )}
    </main>
  );
}
