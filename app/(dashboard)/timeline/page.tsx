import { PageHeader } from "@/components/layout/PageHeader";

export default function TimelinePage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Timeline" description="Your medical history timeline" />
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="mt-1 h-3 w-3 rounded-full bg-sky-600" />
            <div>
              <div className="font-semibold text-slate-900">Lab Results Added</div>
              <div className="text-sm text-slate-500">24 Jan 2026 • Wellness lab report</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />
            <div>
              <div className="font-semibold text-slate-900">Medication Update</div>
              <div className="text-sm text-slate-500">14 Jan 2026 • Pharmacy reconciliation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
