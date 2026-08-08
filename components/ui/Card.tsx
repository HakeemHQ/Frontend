export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {title && <h2 className="text-lg font-bold text-slate-950">{title}</h2>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
