"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  name: string;
  idea: string;
  prd?: string;
  ux?: string;
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
      <header className="border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div className="font-semibold">{project.name}</div>
          <Link href="/dashboard" className="underline text-sm">Back to App</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <h1 className="text-4xl font-extrabold">{project.name}</h1>
        <p className="mt-4 text-lg text-gray-700">{tagline}</p>

        <div className="mt-8 flex gap-3">
          <Link href="/dashboard" className="rounded bg-black text-white px-5 py-3 font-semibold">Try It Free</Link>
          <a href="#" className="rounded border px-5 py-3 font-semibold">Learn More</a>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12 grid gap-6 md:grid-cols-3">
          <div className="rounded border p-4">
            <div className="font-semibold">Benefit 1</div>
            <p className="text-gray-700 mt-2">Describe a key outcome your app gives users.</p>
          </div>
          <div className="rounded border p-4">
            <div className="font-semibold">Benefit 2</div>
            <p className="text-gray-700 mt-2">Use the PRD to refine these later.</p>
          </div>
          <div className="rounded border p-4">
            <div className="font-semibold">Benefit 3</div>
            <p className="text-gray-700 mt-2">This is a mock preview page.</p>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl p-4 text-sm text-gray-600">
          © {new Date().getFullYear()} {project.name}
        </div>
      </footer>
    </main>
  );
}
