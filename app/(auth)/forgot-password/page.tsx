export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">Forgot password?</h1>
        <p className="mt-3 text-sm text-slate-500">Enter your email to receive a reset link.</p>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600" placeholder="you@example.com" />
          </label>
          <button className="w-full rounded-xl bg-sky-900 px-4 py-3 text-sm font-bold text-white">
            Send reset link
          </button>
        </form>
      </section>
    </main>
  );
}
