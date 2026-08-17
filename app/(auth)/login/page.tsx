"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/localization/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

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

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
    }
  }, [error]);

  const onSubmit = async (data: LoginFormValues) => {
    setToast(null);
    const success = await login(data);
    if (success) {
      setToast({ message: t('auth.login.loginSuccessful'), type: "success" });
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-slate-50 text-gray-900 font-sans relative p-4 lg:p-8">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex w-full max-w-[1600px] mx-auto bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* Left Side: Massive Hero Panel */}
        <section className="hidden lg:flex relative w-1/2 flex-col justify-between bg-primary p-16 xl:p-24 overflow-hidden text-white">
          <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
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
              {t('auth.login.heroTitle')}
            </h1>
            <p className="text-2xl text-white/80 leading-relaxed max-w-lg font-medium">
              {t('auth.login.heroSubtitle')}
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

        {/* Right Side: Massive Form */}
        <section className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-16 lg:p-24 relative">
          <div className="absolute top-8 ltr:right-8 rtl:left-8 z-50">
            <LanguageSwitcher />
          </div>
          <div className="w-full max-w-lg space-y-10">
            <div className="text-left">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 font-heading">
                {t('auth.login.title')}
              </h2>
              <p className="mt-4 text-xl text-slate-500 font-medium">
                {t('auth.login.subtitle')}
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <label className="text-lg font-bold text-slate-900" htmlFor="email">
                  {t('auth.login.emailLabel')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  {...register("email")}
                  error={errors.email?.message}
                  iconLeft={<MailIcon className="h-6 w-6 text-slate-400" />}
                  className="bg-slate-50 border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary rounded-[24px] h-20 text-xl font-bold px-6"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-bold text-slate-900" htmlFor="password">
                    {t('auth.login.passwordLabel')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-base font-bold text-primary hover:text-primary/80 hover:underline"
                  >
                    {t('auth.login.forgotPassword')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  {...register("password")}
                  error={errors.password?.message}
                  iconLeft={<LockIcon className="h-6 w-6 text-slate-400" />}
                  className="bg-slate-50 border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary rounded-[24px] h-20 text-xl font-bold px-6"
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none pr-4"
                      aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-6 w-6" />
                      ) : (
                        <EyeIcon className="h-6 w-6" />
                      )}
                    </button>
                  }
                />
              </div>

              <Button type="submit" fullWidth className="bg-primary hover:bg-primary/90 text-white font-black h-20 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-2xl border-none mt-4" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('auth.login.submitting')}
                  </div>
                ) : t('auth.login.submitButton')}
              </Button>
            </form>

            <div className="pt-8">
              <div className="flex items-center justify-center gap-3 rounded-[20px] bg-slate-50 p-6 text-sm font-bold text-primary">
                <ShieldIcon className="h-6 w-6" />
                <span className="text-base">{t('auth.login.securityNote')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
