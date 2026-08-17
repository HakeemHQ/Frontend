"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Toast } from "@/components/ui/Toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema, CreateDoctorInput } from "@/lib/validations/admin";
import { adminApi } from "@/lib/api/admin";
import { useLanguage } from "@/localization/LanguageContext";

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default function AddDoctorPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const specialtyOptions = [
    { value: "Cardiology", label: t('admin.doctors.cardiology') },
    { value: "Neurology", label: t('admin.doctors.neurology') },
    { value: "Pediatrics", label: t('admin.doctors.pediatrics') },
    { value: "Orthopedics", label: t('admin.doctors.orthopedics') },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDoctorInput>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      specialty: "",
      temporaryPassword: "TempPassword!1",
    },
  });

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure at least one number and special char to pass typical rules
    password += "1!"; 
    setValue("temporaryPassword", password, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateDoctorInput) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      await adminApi.createDoctor(data);
      setToast({ message: t('admin.doctors.createSuccess'), type: "success" });
      setTimeout(() => {
        router.push("/admin/doctors");
      }, 1500);
    } catch (error: any) {
      let message = t('admin.doctors.createError');
      if (error.response?.status === 409) {
        message = error.response.data?.message || t('admin.doctors.createConflict');
      } else if (error.response?.status === 422) {
        message = t('admin.doctors.validationFailed');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setToast({ message, type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto px-4 md:px-8 pt-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Massive Form Card */}
      <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 p-12 md:p-20 overflow-hidden relative border border-slate-100">
        
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-base font-bold text-slate-500 mb-12 relative z-10">
          <Link href="/admin/doctors" className="flex items-center gap-2 transition hover:text-primary">
            <ChevronLeftIcon className="h-5 w-5" />
            {t('admin.doctors.title')}
          </Link>
          <span>/</span>
          <span className="text-primary">{t('admin.doctors.addDoctor')}</span>
        </nav>

        {/* Header */}
        <div className="mb-16 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 font-heading">
            {t('admin.doctors.addDoctor')}
          </h1>
          <p className="mt-4 text-xl text-slate-500 font-medium max-w-2xl">
            {t('admin.doctors.addDescription')}
          </p>
        </div>

        <form className="space-y-10 relative z-10 max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <label className="text-lg font-bold text-slate-900">{t('admin.doctors.fullName')}</label>
            <Input 
              {...register("fullName")}
              placeholder="Dr. Ahmed Hassan" 
              error={errors.fullName?.message}
              className="bg-slate-50 border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary rounded-[24px] h-20 text-xl font-bold px-6"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-lg font-bold text-slate-900">{t('admin.doctors.email')}</label>
            <Input 
              {...register("email")}
              type="email" 
              placeholder="ahmed@hakeem.test" 
              error={errors.email?.message}
              className="bg-slate-50 border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary rounded-[24px] h-20 text-xl font-bold px-6"
            />
          </div>
          
          <div className="space-y-3 z-50 relative">
            <label className="text-lg font-bold text-slate-900">{t('admin.doctors.specialty')}</label>
            <div className="bg-slate-50 rounded-[24px]">
              <Select 
                options={specialtyOptions}
                value={watch("specialty")}
                onChange={(v) => setValue("specialty", v, { shouldValidate: true })}
                placeholder={t('admin.doctors.selectSpecialty')}
                error={errors.specialty?.message}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-lg font-bold text-slate-900">{t('admin.doctors.temporaryPassword')}</label>
            <Input 
              {...register("temporaryPassword")}
              type={showPassword ? "text" : "password"} 
              error={errors.temporaryPassword?.message}
              className="bg-slate-50 border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary rounded-[24px] h-20 text-xl font-bold px-6"
              iconRight={
                <div className="flex items-center gap-4 pr-2">
                  <button type="button" onClick={generatePassword} className="text-slate-400 hover:text-primary transition-colors">
                    <RefreshIcon className="w-7 h-7" />
                  </button>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? <EyeOffIcon className="w-7 h-7" /> : <EyeIcon className="w-7 h-7" />}
                  </button>
                </div>
              } 
            />
          </div>
          
          <div className="flex items-center gap-4 rounded-[24px] bg-primary/5 p-6 text-primary">
            <InfoIcon className="shrink-0 w-8 h-8" />
            <p className="text-lg font-bold leading-relaxed">
              {t('admin.doctors.passwordHelpText')}
            </p>
          </div>

          <div className="flex items-center justify-end gap-6 pt-8 border-t-2 border-slate-50">
            <Link href="/admin/doctors">
              <Button variant="outline" type="button" disabled={isSubmitting} className="h-16 px-8 rounded-full text-xl font-bold border-2 text-slate-600 hover:bg-slate-50">
                {t('admin.doctors.cancel')}
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-12 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-xl border-none">
              {isSubmitting ? t('admin.doctors.creating') : t('admin.doctors.createDoctor')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
