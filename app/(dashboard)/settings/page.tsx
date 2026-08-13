import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account, privacy, and preferences"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-950">Personal Information</h3>
          <p className="mt-2 text-sm text-slate-600">
            Manage your profile details.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-950">Privacy Settings</h3>
          <p className="mt-2 text-sm text-slate-600">
            Control record sharing and visibility.
          </p>
        </div>
      </div>
    </section>
  );
}
