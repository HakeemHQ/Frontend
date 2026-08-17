"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Mail01Icon, 
  LockIcon, 
  ViewIcon, 
  ViewOffIcon, 
  Shield01Icon 
} from "@hugeicons/core-free-icons";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 text-gray-900 font-sans relative p-4 sm:p-6 lg:p-8">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 min-h-[580px]">
        {/* Left Side: Hero Panel */}
        <section className="hidden lg:flex relative w-1/2 flex-col justify-between bg-primary p-10 xl:p-12 text-white">
          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary font-bold">
                H
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">{t('common.appName')}</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white font-heading mb-4">
              {t('auth.login.heroTitle')}
            </h1>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed font-medium">
              {t('auth.login.heroSubtitle')}
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <HugeiconsIcon icon={Shield01Icon} className="w-4 h-4 text-emerald-300" />
              <span>Enterprise grade encryption & HIPAA compliance</span>
            </div>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="flex w-full lg:w-1/2 flex-col justify-between p-8 sm:p-12 relative">
          <div className="flex justify-end w-full mb-4">
            <LanguageSwitcher />
          </div>

          <div className="w-full max-w-sm mx-auto my-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
                {t('auth.login.title')}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {t('auth.login.subtitle')}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                  {t('auth.login.emailLabel')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  {...register("email")}
                  error={errors.email?.message}
                  iconLeft={<HugeiconsIcon icon={Mail01Icon} className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                    {t('auth.login.passwordLabel')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary-600 hover:underline"
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
                  iconLeft={<HugeiconsIcon icon={LockIcon} className="h-4 w-4 text-slate-400" />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                      aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                    >
                      <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} className="h-4 w-4" />
                    </button>
                  }
                />
              </div>

              <Button type="submit" fullWidth className="py-2.5 text-sm font-semibold mt-2" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('auth.login.submitting')}
                  </div>
                ) : t('auth.login.submitButton')}
              </Button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <HugeiconsIcon icon={Shield01Icon} className="h-4 w-4 text-primary" />
            <span>{t('auth.login.securityNote')}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
