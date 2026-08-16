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
    <div className="max-w-3xl mx-auto pt-4 pb-12 space-y-8 relative">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-900 transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
          <span>{t('doctor.verifyIdentity.breadcrumbPatients')}</span>
        </Link>
        <span className="mx-3 text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">{t('doctor.verifyIdentity.breadcrumbCurrent')}</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white/80 backdrop-blur-xl border border-slate-100/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8 md:p-12"
      >
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100/50">
            <HugeiconsIcon icon={UserIdVerificationIcon} className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
            {t('doctor.verifyIdentity.title')}
          </h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            {t('doctor.verifyIdentity.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="patientCode">
              {t('doctor.verifyIdentity.patientCode')}
            </label>
            <Input
              placeholder={t('doctor.verifyIdentity.patientCodePlaceholder')}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="h-5 w-5 text-slate-400" />}
              id="patientCode"
              className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-14"
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
              className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-14"
              {...register("nationalId")}
              error={errors.nationalId?.message}
            />
          </div>

          <div className="pt-6">
            <Button 
              type="submit"
              disabled={status === "loading"}
              fullWidth 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all"
            >
              {status === "loading" ? t('doctor.verifyIdentity.processing') : t('doctor.verifyIdentity.submitButton')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
