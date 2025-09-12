"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Project = { name: string; idea: string; prd?: string };

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");

  // Load saved projects and migrate any old string entries -> {name, idea:""}
  useEffect(() => {
    try {
      const raw = localStorage.getItem("projects");
      if (!raw) return;

      const parsed = JSON.parse(raw) as Array<Project | string>;
      const normalized: Project[] = parsed.map((item) =>
        typeof item === "string" ? { name: item, idea: "" } : item
      );
      setProjects(normalized);

      // write back migrated shape so everything is consistent
      localStorage.setItem("projects", JSON.stringify(normalized));
    } catch {}
  }, []);

  // Persist whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem("projects", JSON.stringify(projects));
    } catch {}
  }, [projects]);

  function addProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;
    setProjects((prev) => [...prev, { name: name.trim(), idea: idea.trim() }]);
    setName("");
    setIdea("");
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">📊 Dashboard</h1>

      <form onSubmit={addProject} className="mt-6 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name (e.g., Therapy Track)"
          className="w-full rounded border p-3"
        />
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe the idea (1–3 sentences)"
          rows={3}
          className="w-full rounded border p-3"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 font-semibold text-white"
        >
          Add Project
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {projects.map((p, i) => (
          <li key={i} className="rounded border bg-gray-50 p-3">
            {/* use backticks for the URL and render the project NAME, not the whole object */}
            <Link href={`/dashboard/${i}`} className="underline block">
              {p.name}
            </Link>
            {p.idea && (
              <p className="text-sm text-gray-600 line-clamp-2">{p.idea}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
