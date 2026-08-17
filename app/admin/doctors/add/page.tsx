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
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  RefreshIcon, 
  ViewIcon, 
  ViewOffIcon, 
  UserAdd01Icon 
} from "@hugeicons/core-free-icons";

const generateSecurePassword = () => {
  const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowers = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const specials = "!@#$%^&*";
  const all = uppers + lowers + numbers + specials;

  let pwd = [
    uppers[Math.floor(Math.random() * uppers.length)],
    uppers[Math.floor(Math.random() * uppers.length)],
    lowers[Math.floor(Math.random() * lowers.length)],
    lowers[Math.floor(Math.random() * lowers.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specials[Math.floor(Math.random() * specials.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  for (let i = 0; i < 4; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }

  return pwd.sort(() => Math.random() - 0.5).join("");
};

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
      temporaryPassword: generateSecurePassword(),
    },
  });

  const generatePassword = () => {
    setValue("temporaryPassword", generateSecurePassword(), { shouldValidate: true });
  };

  const onSubmit = async (data: CreateDoctorInput) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      await adminApi.createDoctor(data);
      setToast({ message: t('admin.doctors.createSuccess'), type: "success" });
      setTimeout(() => {
        router.push("/admin/doctors");
      }, 1200);
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
    <div className="space-y-6 pb-12 max-w-3xl mx-auto px-4 sm:px-6 pt-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/admin/doctors" className="inline-flex items-center gap-1 transition hover:text-primary">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('admin.doctors.title')}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{t('admin.doctors.addDoctor')}</span>
      </nav>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-slate-100 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <HugeiconsIcon icon={UserAdd01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
              {t('admin.doctors.addDoctor')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {t('admin.doctors.addDescription')}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t('admin.doctors.fullName')}</label>
            <Input 
              {...register("fullName")}
              placeholder="Dr. Ahmed Hassan" 
              error={errors.fullName?.message}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t('admin.doctors.email')}</label>
            <Input 
              {...register("email")}
              type="email" 
              placeholder="ahmed@hakeem.test" 
              error={errors.email?.message}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t('admin.doctors.specialty')}</label>
            <Select 
              options={specialtyOptions}
              value={watch("specialty")}
              onChange={(v) => setValue("specialty", v, { shouldValidate: true })}
              placeholder={t('admin.doctors.selectSpecialty')}
              error={errors.specialty?.message}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t('admin.doctors.temporaryPassword')}</label>
            <Input 
              {...register("temporaryPassword")}
              type={showPassword ? "text" : "password"} 
              error={errors.temporaryPassword?.message}
              iconRight={
                <div className="flex items-center gap-2 pr-1">
                  <button 
                    type="button" 
                    onClick={generatePassword} 
                    title="Generate new password" 
                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100"
                  >
                    <HugeiconsIcon icon={RefreshIcon} className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    title={showPassword ? "Hide password" : "Show password"} 
                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100"
                  >
                    <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} className="w-4 h-4" />
                  </button>
                </div>
              } 
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
            <Link href="/admin/doctors">
              <Button variant="outline" type="button" disabled={isSubmitting} className="px-4 py-2 text-xs sm:text-sm font-semibold">
                {t('admin.doctors.cancel')}
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="px-5 py-2 text-xs sm:text-sm font-semibold">
              {isSubmitting ? t('admin.doctors.creating') : t('admin.doctors.createDoctor')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
