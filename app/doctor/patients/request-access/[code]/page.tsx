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
      let errorMessage = t('doctor.requestAccess.failedMessage');
      
      const statusCode = err.response?.status;
      if (statusCode === 404) {
        errorMessage = t('doctor.requestAccess.patientNotFound');
      } else if (statusCode === 409) {
        errorMessage = t('doctor.requestAccess.alreadyPending');
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

      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px] mx-4 md:mx-auto max-w-5xl mt-4">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={UserIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation */}
        <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
          <Link 
            href="/doctor/patients"
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md cursor-pointer border-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.requestAccess.breadcrumbPatients')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.requestAccess.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
            {t('doctor.requestAccess.subtitle')}
          </p>
        </div>
      </div>

      <div className="w-full bg-white border-0 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-3xl">

      <div className="max-w-lg mx-auto">
        <div className="w-full border-2 border-slate-100 rounded-[32px] p-8 bg-slate-50 shadow-sm mb-8 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
          {/* Patient Details */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center border-2 border-slate-100 overflow-hidden shrink-0 shadow-sm">
              <HugeiconsIcon icon={UserIcon} className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">{t('doctor.requestAccess.patientData')}</h3>
              <p className="text-slate-500 text-base font-bold mt-1">{t('doctor.requestAccess.patientCode')}: {code}</p>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="mt-8 flex items-start gap-4 p-6 bg-primary/10 rounded-[24px] border-2 border-primary/20">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-8 h-8 text-primary shrink-0 mt-0.5" />
            <p className="text-lg font-bold text-slate-700">
              {t('doctor.requestAccess.infoMessage')}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            onClick={handleRequestAccess}
            disabled={isSending}
            fullWidth 
            className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all border-none"
          >
            {isSending ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 {t('doctor.requestAccess.sending')}
               </div>
            ) : t('doctor.requestAccess.sendRequest')}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
