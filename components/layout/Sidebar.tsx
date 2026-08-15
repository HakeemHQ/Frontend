"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export function Sidebar() {
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), href: "/home", icon: "Home" },
    { label: t("nav.timeline"), href: "/timeline", icon: "Clock" },
    { label: t("nav.medicalCv"), href: "/medical-cv", icon: "FileText" },
    { label: t("nav.upload"), href: "/upload", icon: "Upload" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[240px] border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="3" y="2" width="9" height="28" fill="#2563eb" />
              <rect x="12" y="11" width="8" height="10" fill="#2563eb" />
              <path d="M20 2H29V21L20 30V2Z" fill="#2563eb" />
              <path d="M29 21V30H20L29 21Z" fill="#10b981" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            {t("common.appName")}
          </span>
        </div>

        <nav className="mt-8 flex-1 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-900"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div className="my-6 border-t border-slate-200" />

          <a
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              {t("nav.settings")}
            </span>
            <span>{t("nav.settings")}</span>
          </a>
        </nav>

        <div className="border-t border-slate-200 px-4 py-5 space-y-4">
          <div className="flex w-full justify-center">
            <LanguageSwitcher />
          </div>
          <button className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            {t("nav.collapse")}
          </button>
        </div>
      </div>
    </aside>
  );
}
