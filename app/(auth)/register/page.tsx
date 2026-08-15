"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl font-black text-sky-900">
            {t('common.appName').charAt(0)}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            {t('auth.register.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t('auth.register.subtitle')}
          </p>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              {t('auth.register.fullNameLabel')}
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder={t('auth.register.fullNamePlaceholder')}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              {t('auth.register.emailLabel')}
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              {t('auth.register.passwordLabel')}
            </span>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder={t('auth.register.passwordPlaceholder')}
            />
          </label>
          <button className="w-full rounded-xl bg-sky-900 px-4 py-3 text-sm font-bold text-white">
            {t('auth.register.submitButton')}
          </button>
        </form>
      </section>
    </main>
  );
}
