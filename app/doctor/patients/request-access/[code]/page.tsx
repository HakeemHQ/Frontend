"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { requestPatientAccess } from "@/lib/api/patients";
import {
  ArrowLeft01Icon,
  InformationCircleIcon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

export default function RequestAccessPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code } = use(params);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const handleRequestAccess = async () => {
    setIsSending(true);
    setToast(null);
    
    try {
      await requestPatientAccess({ patientCode: code });
      // The API returns 201 Created on success
      setToast({ message: t('doctor.requestAccess.successMessage'), type: "success" });
      
      // Delay navigation slightly so user can see success toast
      setTimeout(() => {
        router.push(`/doctor/patients/redeem-access/${code}`);
      }, 1000);
    } catch (err: any) {
      let errorMessage = t('doctor.requestAccess.errorDefault');
      
      const statusCode = err.response?.status;
      if (statusCode === 404) {
        errorMessage = t('doctor.requestAccess.errorNotFound');
      } else if (statusCode === 409) {
        errorMessage = t('doctor.requestAccess.errorConflict');
      } else if (statusCode === 422) {
        errorMessage = t('doctor.requestAccess.errorFormat');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setToast({ message: errorMessage, type: "error" });
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative animate-in fade-in duration-300">
      <AnimatePresence>
        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>{t('doctor.requestAccess.patients')}</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">{t('doctor.requestAccess.title')}</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          {t('doctor.requestAccess.heading')}
        </h1>
        <p className="text-slate-500 text-sm">
          {t('doctor.requestAccess.description')}
        </p>
      </div>

      <div className="max-w-lg mt-8">
        <div className="w-full border border-slate-100 rounded-2xl p-6 bg-surface shadow-sm mb-6 transition-all hover:shadow-md">
          {/* Patient Details */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              {/* Fallback avatar since we don't have the explicit image asset */}
              <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{t('doctor.requestAccess.patientData')}</h3>
              <p className="text-slate-500 text-sm">{t('doctor.requestAccess.patientCode')}: {code}</p>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-background rounded-xl border border-slate-100">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              {t('doctor.requestAccess.infoAlert')}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleRequestAccess}
          disabled={isSending}
          fullWidth 
          className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
        >
          {isSending ? t('doctor.requestAccess.sending') : t('doctor.requestAccess.send')}
        </Button>
      </div>
    </div>
  );
}
