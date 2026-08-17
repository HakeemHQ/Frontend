export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
      {title && <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tight mb-2">{title}</h2>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
