import { PageHeader } from "@/components/layout/PageHeader";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Home" description="Overview of your medical workspace" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Documents</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">12</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Medical CV</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">82%</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Timeline</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">18</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-500">AI Review</div>
          <div className="mt-3 text-3xl font-bold text-slate-950">3</div>
        </div>
      </div>
    </section>
  );
}
