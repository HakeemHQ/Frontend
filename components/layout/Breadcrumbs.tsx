"use client";

import { useLanguage } from "@/localization/LanguageContext";

export function Breadcrumbs() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm font-semibold text-slate-500"
    >
      <span className="text-slate-900">{t("nav.dashboard")}</span>
      <span className="mx-2">/</span>
      <span>{t("nav.dashboard")}</span>
    </nav>
  );
}
