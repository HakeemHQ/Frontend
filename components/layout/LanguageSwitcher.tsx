"use client";

import { useLanguage } from "@/localization/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
      title={locale === "en" ? t("language.arabic") : t("language.english")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      <span>{locale === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
