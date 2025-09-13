import Link from "next/link";

export default function PreviewIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Preview Index</h1>
      <p className="mt-2 text-gray-600">
        Open a specific preview like <code>/preview/0</code>, <code>/preview/1</code>, etc.
      </p>

      <div className="mt-6">
        <Link href="/dashboard" className="underline">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
