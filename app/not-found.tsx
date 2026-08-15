"use client";
import { useLanguage } from "@/localization/LanguageContext";
export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
        <h1 className="text-4xl font-black text-slate-950">{t('notFound.title')}</h1>
        <p className="mt-4 text-slate-600">{t('notFound.message')}</p>
      </div>
    </main>
  );
}
