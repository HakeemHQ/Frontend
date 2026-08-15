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
        <div className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 md:block">
          {t('nav.search')}
        </div>
        <LanguageSwitcher />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-900 font-bold text-white">
          H
        </div>
      </div>
    </header>
  );
}
