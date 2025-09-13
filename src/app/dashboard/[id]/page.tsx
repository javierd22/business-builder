"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Project = {
  name: string;
  idea: string;
  prd?: string;
  ux?: string;
  previewUrl?: string;
  stage?: number;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const idParam = (params?.id as string) ?? "";
  const idx = Number(idParam);

  const [project, setProject] = useState<Project | null>(null);

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

  async function deploySite() {
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Deploy failed: ${res.status} ${res.statusText}\n${msg}`);
        return;
      }
      alert("Deploy triggered! Check your Vercel dashboard.");
    } catch (e) {
      console.error(e);
      alert("Deploy request failed. See console.");
    }
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <Link href="/dashboard" className="underline">
          ← Back to Dashboard
        </Link>
        <p className="mt-6">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 space-y-6">
      <Link href="/dashboard" className="underline">
        ← Back to Dashboard
      </Link>

      <section>
        <h1 className="mt-4 text-2xl font-bold">Project Details</h1>
        <p className="mt-2 text-gray-400">
          ID: <code>{idParam}</code>
        </p>
      </section>

      <section className="rounded border bg-gray-50/5 p-4">
        <h2 className="font-semibold">Name</h2>
        <p className="mt-1">{project.name}</p>
      </section>

      <section className="rounded border bg-gray-50/5 p-4">
        <h2 className="font-semibold">Idea</h2>
        <p className="mt-1 whitespace-pre-wrap">{project.idea}</p>
      </section>

      <section className="flex flex-wrap gap-3">
        <button
          onClick={deploySite}
          className="rounded bg-white text-black px-4 py-2 font-semibold"
        >
          Deploy site
        </button>
      </section>
    </main>
  );
}
