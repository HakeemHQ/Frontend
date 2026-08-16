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

      {/* Header Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 rtl:rotate-180 mr-1 rtl:mr-0 rtl:ml-1" />
          <span>{t('doctor.redeemAccess.breadcrumbPatients')}</span>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-900">{t('doctor.redeemAccess.breadcrumbCurrent')}</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          {t('doctor.redeemAccess.title')}
        </h1>
        <p className="text-slate-500 text-sm">
          {t('doctor.redeemAccess.subtitle')}
        </p>
      </div>

      <div className="max-w-lg mt-8">
        <div className="w-full border border-slate-100 rounded-2xl p-6 bg-surface shadow-sm mb-6 transition-all hover:shadow-md">
          {/* Patient Details */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              {/* Fallback avatar */}
              <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{t('doctor.redeemAccess.patientData')}</h3>
              <p className="text-slate-500 text-sm">{t('doctor.redeemAccess.patientCode')}: {code}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="ot-code">
              {t('doctor.redeemAccess.oneTimeCode')}
            </label>
            <Input
              id="ot-code"
              placeholder="482913"
              value={oneTimeCode}
              onChange={(e) => setOneTimeCode(e.target.value)}
              maxLength={6}
              className="font-medium tracking-widest text-center"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRedeem}
            disabled={isRedeeming}
            fullWidth 
            className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
          >
            {isRedeeming ? t('doctor.redeemAccess.redeeming') : t('doctor.redeemAccess.redeemButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
