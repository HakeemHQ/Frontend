import { PageHeader } from "@/components/layout/PageHeader";

export default function UploadPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Upload" description="Bring in your medical documents" />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="text-lg font-bold text-slate-900">Upload documents</div>
        <p className="mt-2 text-sm text-slate-500">
          Select documents to begin your record review flow.
        </p>
        <button className="mt-6 rounded-xl bg-primary-900 px-5 py-3 text-sm font-bold text-white">
          Choose files
        </button>
      </div>
    </section>
  );
}
