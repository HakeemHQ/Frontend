"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Link from "next/link";

const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen w-full bg-slate-50 text-gray-900 font-sans relative p-4 lg:p-8">
      <div className="absolute top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>

      <div className="flex w-full max-w-[1600px] mx-auto bg-white rounded-[24px] lg:rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[calc(100vh-4rem)] flex-col lg:flex-row-reverse">
        {/* Right Side: Massive Hero Panel */}
        <section className="hidden lg:flex relative w-1/2 flex-col justify-between bg-primary p-16 xl:p-24 overflow-hidden text-white">
          <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16" />
                  <path d="M4 12h16" />
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tighter text-white font-heading">{t('common.appName')}</span>
            </div>

            <h1 className="mb-8 text-6xl xl:text-7xl font-black leading-none tracking-tighter text-white font-heading">
              {t('auth.register.title')}
            </h1>
            <p className="text-2xl text-white/80 leading-relaxed max-w-lg font-medium">
              {t('auth.register.subtitle')}
            </p>
          </div>

          <div className="relative w-full h-48 mt-12">
            <div className="absolute left-0 top-0 flex w-72 items-center gap-4 rounded-3xl bg-white/10 p-5 shadow-xl backdrop-blur-md border border-white/20">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-white text-primary">
                <FileIcon className="h-7 w-7" />
              </div>
              <div className="space-y-3 w-full">
                <div className="h-3 w-full rounded-full bg-white/30"></div>
                <div className="h-3 w-2/3 rounded-full bg-white/20"></div>
              </div>
            </div>
            
            <div className="absolute right-0 top-24 flex w-72 items-center gap-4 rounded-3xl bg-white/10 p-5 shadow-xl backdrop-blur-md border border-white/20">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-white text-primary">
                <HistoryIcon className="h-7 w-7" />
              </div>
              <div className="space-y-3 w-full">
                <div className="h-3 w-full rounded-full bg-white/30"></div>
                <div className="h-3 w-1/2 rounded-full bg-white/20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Left Side: Massive Form */}
        <section className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-16 lg:p-24 relative">
          <div className="w-full max-w-lg space-y-10">
            <div className="text-left">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 font-heading">
                {t('auth.register.title')}
              </h2>
              <p className="mt-4 text-xl text-slate-500 font-medium">
                {t('auth.register.subtitle')}
              </p>
            </div>

            <form className="space-y-6">
              <div className="space-y-3">
                <label className="text-lg font-bold text-slate-900">
                  {t('auth.register.fullNameLabel')}
                </label>
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 outline-none focus:border-primary rounded-[24px] h-20 text-xl font-bold px-6 transition-all"
                  placeholder={t('auth.register.fullNamePlaceholder')}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-lg font-bold text-slate-900">
                  {t('auth.register.emailLabel')}
                </label>
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 outline-none focus:border-primary rounded-[24px] h-20 text-xl font-bold px-6 transition-all"
                  placeholder={t('auth.register.emailPlaceholder')}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-lg font-bold text-slate-900">
                  {t('auth.register.passwordLabel')}
                </label>
                <input
                  type="password"
                  className="w-full bg-slate-50 border-2 border-slate-100 outline-none focus:border-primary rounded-[24px] h-20 text-xl font-bold px-6 transition-all"
                  placeholder={t('auth.register.passwordPlaceholder')}
                />
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-20 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-2xl border-none mt-4">
                {t('auth.register.submitButton')}
              </button>
            </form>

            <div className="text-center pt-6">
              <p className="text-lg font-bold text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
