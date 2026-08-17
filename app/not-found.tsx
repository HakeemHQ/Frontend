"use client";
import { useLanguage } from "@/localization/LanguageContext";
export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 relative p-8">
      <div className="rounded-[48px] bg-primary p-16 text-center shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col items-center justify-center w-full max-w-4xl min-h-[500px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-24 opacity-10 text-white transform rotate-12 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-8xl font-black text-white font-heading tracking-tighter">
            {t('notFound.title') || "404"}
          </h1>
          <p className="text-2xl text-white/80 font-medium">
            {t('notFound.message') || "Page not found"}
          </p>
        </div>
      </div>
    </main>
  );
}
