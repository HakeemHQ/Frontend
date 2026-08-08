export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center bg-sky-950 p-12 text-white">
          <div>
            <div className="text-5xl font-black tracking-tight">Hakeem</div>
            <div className="mt-8 max-w-lg text-xl font-light leading-8 text-sky-100">
              Build a complete medical history that follows you through every appointment.
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center p-10">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-950">Welcome to Hakeem</h1>
              <p className="mt-3 text-slate-500">Let’s organize your medical records.</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="font-bold text-slate-950">1. Upload your documents</div>
                <p className="mt-2 text-sm text-slate-500">Bring your prescriptions, reports, and visit records.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="font-bold text-slate-950">2. Review your timeline</div>
                <p className="mt-2 text-sm text-slate-500">Understand your complete medical story.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="font-bold text-slate-950">3. Share your Medical CV</div>
                <p className="mt-2 text-sm text-slate-500">Generate a clean, portable patient health profile.</p>
              </div>
            </div>

            <button className="mt-8 rounded-xl bg-sky-900 px-6 py-3 text-sm font-bold text-white">
              Start onboarding
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
