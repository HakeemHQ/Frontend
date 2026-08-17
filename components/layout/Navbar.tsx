"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold text-slate-500">{t('common.appName')}</div>
        <div className="h-5 w-px bg-slate-200" />
        <div className="text-sm font-semibold text-slate-800">{t('nav.dashboard')}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm text-slate-500 md:block hover:bg-slate-100 transition-colors">
          {t('nav.search')}
        </div>
        <LanguageSwitcher />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md shadow-primary/20">
          H
        </div>
      </div>
    </header>
  );
}
