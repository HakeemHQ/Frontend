import { PageHeader } from "@/components/layout/PageHeader";

export default function MedicalCVPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Medical CV" description="Your patient medical summary" />
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Current Medical CV</h2>
            <p className="mt-3 text-slate-600">Completed with 24 record sources</p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Download PDF
            </button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
