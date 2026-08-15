"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">{t('auth.forgotPassword.title')}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {t('auth.forgotPassword.subtitle')}
        </p>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              {t('auth.forgotPassword.emailLabel')}
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
            />
          </label>
          <button className="w-full rounded-xl bg-sky-900 px-4 py-3 text-sm font-bold text-white">
            {t('auth.forgotPassword.submitButton')}
          </button>
        </form>
      </section>
    </main>
  );
}
