// src/app/styleguide/page.tsx
import Link from "next/link";

export const metadata = { title: "Styleguide" };

export default function Styleguide() {
  const swatches = [
    { name: "brand.blue", hex: "#2563EB", className: "bg-brand-blue text-text-onBrand" },
    { name: "brand.lime", hex: "#D3F365", className: "bg-brand-lime text-text-onLime" },
    { name: "brand.orange", hex: "#F59E0B", className: "bg-brand-orange text-text-onBrand" },
    { name: "brand.lavender", hex: "#C7C7F9", className: "bg-brand-lavender text-text" },
    { name: "brand.periwinkle", hex: "#D7DBFF", className: "bg-brand-periwinkle text-text" },
    { name: "brand.peach", hex: "#FFB37B", className: "bg-brand-peach text-text" },
    { name: "surface.DEFAULT", hex: "#FFFFFF", className: "bg-white text-text" },
    { name: "border.DEFAULT", hex: "#E5E7EB", className: "bg-border text-text" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-lavender via-brand-periwinkle to-transparent [background-image:linear-gradient(180deg,transparent,rgba(255,179,123,0.55))]">
      <header className="sticky top-0 z-40 border-b border-border bg-surface-glass backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">Business Builder</Link>
          <Link
            href="/idea"
            className="rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-text-onLime shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
          >
            Start Building
          </Link>
        </div>
      </header>

      <section className="container py-10">
        <h1 className="text-3xl font-bold text-text">Daybreak Palette</h1>
        <p className="mt-2 text-text-muted">
          Quick swatches to confirm tokens compile correctly.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-white shadow-soft">
              <div className={`h-20 rounded-t-xl ${s.className}`} />
              <div className="p-3 text-sm">
                <div className="font-medium">{s.name}</div>
                <div className="text-text-muted">{s.hex}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-text">Buttons</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-lg bg-brand-blue px-4 py-2 text-text-onBrand shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue">
            Primary (Blue)
          </button>
          <button className="rounded-lg bg-brand-orange px-4 py-2 text-text-onBrand shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue">
            CTA (Orange)
          </button>
          <button className="rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-text-onLime shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue">
            Accent (Lime)
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-text shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue">
            Secondary
          </button>
        </div>
      </section>
    </main>
  );
}
