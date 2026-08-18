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
  UserIcon,
  Key01Icon,
  Shield01Icon
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
      }, 600);
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
          <span>{t('doctor.redeemAccess.breadcrumbPatients')}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{t('doctor.redeemAccess.title')}</span>
      </nav>

      {/* Form Card */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3.5 pb-5 mb-5 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Key01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading">
              {t('doctor.redeemAccess.title')}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              {t('doctor.redeemAccess.subtitle')}
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
                <span className="text-xs font-bold text-slate-700 block">{t('doctor.redeemAccess.patientData')}</span>
                <span className="text-xs text-slate-500 font-medium">Code: <span className="font-mono font-bold text-slate-900">{code}</span></span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
              Verification Required
            </span>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700" htmlFor="ot-code">
              {t('doctor.redeemAccess.oneTimeCode')}
            </label>
            <Input
              id="ot-code"
              placeholder="482913"
              value={oneTimeCode}
              onChange={(e) => setOneTimeCode(e.target.value)}
              maxLength={6}
              className="text-center font-mono text-lg font-bold tracking-[0.35em] h-11"
              iconLeft={<HugeiconsIcon icon={Shield01Icon} className="h-4 w-4 text-slate-400" />}
            />
            <p className="text-[11px] text-slate-400 text-center pt-1">
              Enter the 6-digit code displayed on the patient&apos;s mobile device
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <Button 
              onClick={handleRedeem}
              disabled={isRedeeming}
              fullWidth 
              className="py-2.5 text-sm font-semibold"
            >
              {isRedeeming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('doctor.redeemAccess.redeeming')}</span>
                </div>
              ) : (
                t('doctor.redeemAccess.redeemButton')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
