"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPatientAccess } from "@/lib/api/patients";
import {
  ArrowLeft01Icon,
  Search01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

const getRequestAccessSchema = (t: any) => z.object({
  patientCode: z.string().min(1, t('doctor.requestAccess.invalidFormat') || "Patient code is required"),
});

type RequestAccessFormValues = z.infer<ReturnType<typeof getRequestAccessSchema>>;

export default function RequestAccessPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestAccessFormValues>({
    resolver: zodResolver(getRequestAccessSchema(t)),
    defaultValues: {
      patientCode: "",
    },
  });

  const onSubmit = async (data: RequestAccessFormValues) => {
    setStatus("loading");
    setToast(null);

    try {
      try {
        await requestPatientAccess({ patientCode: data.patientCode });
      } catch (reqErr: any) {
        const reqStatus = reqErr.response?.status;
        if (reqStatus !== 409) {
          throw reqErr;
        }
      }
      
      setToast({ message: t('doctor.requestAccess.successMessage'), type: "success" });
      setTimeout(() => {
        router.push(`/doctor/patients/redeem-access/${data.patientCode}`);
      }, 500);

    } catch (err: any) {
      setStatus("idle");
      let errorMessage = t('doctor.requestAccess.failedMessage');
      
      const statusCode = err.response?.status;
      if (statusCode === 404) {
        // Not verified, navigate to verify-identity
        setToast({ message: t('doctor.requestAccess.patientNotFound') || "Patient not found. Please verify the patient first.", type: "warning" });
        setTimeout(() => {
          router.push(`/doctor/verify-identity?code=${data.patientCode}`);
        }, 1500);
        return;
      } else if (statusCode === 422) {
        errorMessage = t('doctor.requestAccess.invalidFormat');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/doctor/patients" className="inline-flex items-center gap-1 transition hover:text-primary">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('doctor.requestAccess.breadcrumbPatients')}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{t('doctor.requestAccess.title')}</span>
      </nav>

      {/* Form Card */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3.5 pb-5 mb-5 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Shield01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading">
              {t('doctor.requestAccess.title')}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              {t('doctor.requestAccess.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="patientCode">
              {t('doctor.verifyIdentity.patientCode') || "Patient Code"}
            </label>
            <Input
              placeholder={t('doctor.verifyIdentity.patientCodePlaceholder') || "Enter patient code"}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="h-4 w-4 text-slate-400" />}
              id="patientCode"
              {...register("patientCode")}
              error={errors.patientCode?.message}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <Button 
              type="submit"
              disabled={status === "loading"}
              fullWidth 
              className="py-2.5 text-sm font-semibold"
            >
              {status === "loading" ? t('doctor.requestAccess.sending') : t('doctor.requestAccess.sendRequest')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
