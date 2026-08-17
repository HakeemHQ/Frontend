"use client";

import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen h-screen w-full bg-white text-gray-900 font-sans relative overflow-hidden">
      <div className="flex w-full h-full">
        {/* Left Side: Hero Panel (Edge-to-Edge) */}
        <section className="hidden lg:flex relative w-1/2 h-full flex-col justify-between bg-primary p-12 xl:p-16 text-white shrink-0">
          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary font-bold text-lg">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-heading">{t('common.appName')}</span>
            </div>

            <h1 className="text-3xl xl:text-5xl font-black leading-tight tracking-tight text-white font-heading mb-6 max-w-lg">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-base xl:text-lg text-white/80 leading-relaxed font-medium max-w-md">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>
        </section>

        {/* Right Side: Form (Edge-to-Edge) */}
        <section className="flex w-full lg:w-1/2 h-full flex-col justify-between p-8 sm:p-12 xl:p-16 relative overflow-y-auto bg-white">
          <div className="flex justify-end w-full">
            <LanguageSwitcher />
          </div>

          <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
                {t('auth.forgotPassword.title')}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                {t('auth.forgotPassword.subtitle')}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {t('auth.forgotPassword.emailLabel')}
                </label>
                <Input
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  iconLeft={<HugeiconsIcon icon={Mail01Icon} className="h-4 w-4 text-slate-400" />}
                />
              </div>
              
              <Button type="submit" fullWidth className="py-2.5 text-sm font-semibold mt-2">
                {t('auth.forgotPassword.submitButton')}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t('auth.forgotPassword.backToSignIn')}</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            {t('common.brandTagline')}
          </div>
        </section>
      </div>
    </main>
  );
}
