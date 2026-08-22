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
  UserIcon,
  Shield01Icon
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
      try {
        await requestPatientAccess({ patientCode: code });
      } catch (reqErr: any) {
        const reqStatus = reqErr.response?.status;
        if (reqStatus !== 409) {
          throw reqErr;
        }
      }
      
      setToast({ message: t('doctor.requestAccess.successMessage'), type: "success" });
      
      setTimeout(() => {
        router.push(`/doctor/patients/redeem-access/${code}`);
      }, 600);
    } catch (err: any) {
      let errorMessage = t('doctor.requestAccess.failedMessage');
      
      const statusCode = err.response?.status;
      if (statusCode === 404) {
        errorMessage = t('doctor.requestAccess.patientNotFound');
      } else if (statusCode === 422) {
        errorMessage = t('doctor.requestAccess.invalidFormat');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setToast({ message: errorMessage, type: "error" });
      setIsSending(false);
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

        <div className="space-y-4">
          {/* Patient Details Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <HugeiconsIcon icon={UserIcon} className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">{t('doctor.requestAccess.patientData')}</span>
                <span className="text-xs text-slate-500 font-medium">Code: <span className="font-mono font-bold text-slate-900">{code}</span></span>
              </div>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="flex items-start gap-3 p-3.5 bg-primary/5 rounded-xl border border-primary/15">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {t('doctor.requestAccess.infoMessage')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 mt-6">
            <Button 
              onClick={handleRequestAccess}
              disabled={isSending}
              fullWidth 
              className="py-2.5 text-sm font-semibold"
            >
              {isSending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('doctor.requestAccess.sending')}</span>
                </div>
              ) : (
                t('doctor.requestAccess.sendRequest')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
