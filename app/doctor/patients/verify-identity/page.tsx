"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPatientAccess, verifyPatientIdentity, VerifyPatientResponse } from "@/lib/api/patients";
import {
  ArrowLeft01Icon,
  Search01Icon,
  UserIdVerificationIcon,
  CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/localization/LanguageContext";

  const getVerifySchema = (t: any) => z.object({
  patientCode: z.string().min(1, t('doctor.verifyIdentity.invalidCode')),
  nationalId: z.string().min(1, t('doctor.verifyIdentity.formatMismatch')),
});

type VerifyFormValues = z.infer<ReturnType<typeof getVerifySchema>>;

export default function VerifyIdentityPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(getVerifySchema(t)),
    defaultValues: {
      patientCode: "",
      nationalId: "",
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setStatus("loading");
    setToast(null);

    try {
      // 1. Verify Identity
      await verifyPatientIdentity(data);
      
      // 2. Automatically Request Access
      try {
        await requestPatientAccess({ patientCode: data.patientCode });
      } catch (reqErr: any) {
        const reqStatus = reqErr.response?.status;
        // If 409, it means a request is already pending or active, which is fine to proceed to redeem
        if (reqStatus !== 409) {
          throw reqErr; // Throw to the outer catch if it's an unexpected error
        }
      }
      
      // 3. Navigate directly to redeem page
      setToast({ message: t('doctor.verifyIdentity.successMessage'), type: "success" });
      setTimeout(() => {
        router.push(`/doctor/patients/redeem-access/${data.patientCode}`);
      }, 500);

    } catch (err: any) {
      setStatus("idle");
      let errorMessage = t('doctor.verifyIdentity.failedMessage');
      
      const statusCode = err.response?.status;
      if (statusCode === 404) {
        errorMessage = t('doctor.verifyIdentity.invalidCode');
      } else if (statusCode === 409) {
        errorMessage = t('doctor.verifyIdentity.alreadyVerified');
      } else if (statusCode === 422) {
        errorMessage = t('doctor.verifyIdentity.formatMismatch');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative animate-in fade-in duration-300">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px] mx-4 md:mx-auto max-w-5xl mt-4">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={UserIdVerificationIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation */}
        <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
          <Link 
            href="/doctor/patients"
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md cursor-pointer border-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.verifyIdentity.breadcrumbPatients')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.verifyIdentity.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
            {t('doctor.verifyIdentity.subtitle')}
          </p>
        </div>
      </div>

      <div className="w-full bg-white border-0 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="patientCode">
              {t('doctor.verifyIdentity.patientCode')}
            </label>
            <Input
              placeholder={t('doctor.verifyIdentity.patientCodePlaceholder')}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="h-5 w-5 text-slate-400" />}
              id="patientCode"
              className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-2xl h-14"
              {...register("patientCode")}
              error={errors.patientCode?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="nationalId">
              {t('doctor.verifyIdentity.nationalId')}
            </label>
            <Input
              placeholder={t('doctor.verifyIdentity.nationalIdPlaceholder')}
              iconLeft={<HugeiconsIcon icon={UserIdVerificationIcon} className="h-5 w-5 text-slate-400" />}
              id="nationalId"
              className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-2xl h-14"
              {...register("nationalId")}
              error={errors.nationalId?.message}
            />
          </div>

          <div className="pt-6">
            <Button 
              type="submit"
              disabled={status === "loading"}
              fullWidth 
              className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all border-none"
            >
              {status === "loading" ? t('doctor.verifyIdentity.processing') : t('doctor.verifyIdentity.submitButton')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
