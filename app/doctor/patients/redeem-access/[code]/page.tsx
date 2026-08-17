"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { redeemPatientAccess } from "@/lib/api/patients";
import {
  ArrowLeft01Icon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

export default function RedeemAccessPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code } = use(params);
  const [oneTimeCode, setOneTimeCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const handleRedeem = async () => {
    if (!oneTimeCode || oneTimeCode.length < 6) {
      setToast({ message: t('doctor.redeemAccess.invalidCode'), type: "warning" });
      return;
    }

    setIsRedeeming(true);
    setToast(null);
    
    try {
      const res = await redeemPatientAccess({ patientCode: code, oneTimeCode });
      const accessData = (res as any).data || res;
      sessionStorage.setItem(`access_${code}`, JSON.stringify(accessData));
      
      setToast({ message: t('doctor.redeemAccess.successMessage'), type: "success" });
      setTimeout(() => {
        router.push(`/doctor/patients/access-granted/${code}`);
      }, 1000);
    } catch (err: any) {
      let errorMessage = t('doctor.redeemAccess.failedMessage');
      
      const statusCode = err.response?.status;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (statusCode === 401 || statusCode === 403) {
        errorMessage = t('doctor.redeemAccess.unauthorized');
      } else if (statusCode === 409) {
        errorMessage = t('doctor.redeemAccess.expiredCode');
      } else if (statusCode === 422) {
        errorMessage = t('doctor.redeemAccess.invalidFormat');
      }
      
      setToast({ message: errorMessage, type: "error" });
      setIsRedeeming(false);
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
            {t('doctor.redeemAccess.breadcrumbPatients')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.redeemAccess.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
            {t('doctor.redeemAccess.subtitle')}
          </p>
        </div>
      </div>

      <div className="w-full bg-white border-0 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-3xl">
        <div className="max-w-lg mx-auto">
          <div className="w-full border-2 border-slate-100 rounded-[32px] p-8 bg-slate-50 shadow-sm mb-8 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
            {/* Patient Details */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center border-2 border-slate-100 overflow-hidden shrink-0 shadow-sm">
                <HugeiconsIcon icon={UserIcon} className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">{t('doctor.redeemAccess.patientData')}</h3>
                <p className="text-slate-500 text-base font-bold mt-1">{t('doctor.redeemAccess.patientCode')}: {code}</p>
              </div>
            </div>

            <div className="border-t-2 border-slate-100 pt-8">
              <label className="block text-sm font-bold text-slate-900 mb-2" htmlFor="ot-code">
                {t('doctor.redeemAccess.oneTimeCode')}
              </label>
              <Input
                id="ot-code"
                placeholder="482913"
                value={oneTimeCode}
                onChange={(e) => setOneTimeCode(e.target.value)}
                maxLength={6}
                className="font-bold text-2xl tracking-[0.5em] text-center h-20 rounded-[24px] bg-white border-2 border-slate-200 focus-visible:border-primary focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            <Button 
              onClick={handleRedeem}
              disabled={isRedeeming}
              fullWidth 
              className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all border-none"
            >
              {isRedeeming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('doctor.redeemAccess.redeeming')}
                </div>
              ) : t('doctor.redeemAccess.redeemButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
