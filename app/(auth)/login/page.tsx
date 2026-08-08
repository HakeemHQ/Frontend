export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl font-black text-sky-900">
            H
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your Hakeem account
          </p>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder="••••••••"
            />
          </label>
          <button className="w-full rounded-xl bg-sky-900 px-4 py-3 text-sm font-bold text-white">
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <a className="font-semibold text-sky-900" href="/register">
            Create an account
          </a>
        </div>
      </section>
    </main>
  );
}
