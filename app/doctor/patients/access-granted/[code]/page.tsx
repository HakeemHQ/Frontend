"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLanguage } from "@/localization/LanguageContext";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  UserIcon
} from "@hugeicons/core-free-icons";

export default function AccessGrantedPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const { code } = use(params);
  const [accessData, setAccessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem(`access_${code}`);
    if (data) {
      try {
        setAccessData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse access data from session storage");
      }
    }
    setIsLoading(false);
  }, [code]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    let ds = dateString;
    if (!ds.endsWith('Z')) ds += 'Z';
    const date = new Date(ds);
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const calculateTimeLimit = (granted?: string, expires?: string) => {
    if (!granted || !expires) return t('doctor.accessGranted.na');
    let gStr = granted;
    let eStr = expires;
    if (!gStr.endsWith('Z')) gStr += 'Z';
    if (!eStr.endsWith('Z')) eStr += 'Z';
    const g = new Date(gStr).getTime();
    const e = new Date(eStr).getTime();
    const diffHours = Math.round((e - g) / (1000 * 60 * 60));
    return `${diffHours} ${diffHours === 1 ? t('doctor.accessGranted.hour') : t('doctor.accessGranted.hours')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008060]"></div>
      </div>
    );
  }

  // Fallback to current time if no data (e.g. accessed directly without redeeming)
  const grantedAtTime = accessData?.grantedAt || new Date().toISOString();
  const expiresAtTime = accessData?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const patientName = accessData?.patient?.fullName || "Patient";
  const patientCode = accessData?.patient?.patientCode || code;

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative animate-in fade-in duration-300">
      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px] mx-4 md:mx-auto max-w-5xl mt-4">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation */}
        <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
          <Link 
            href="/doctor/patients"
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md cursor-pointer border-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.accessGranted.breadcrumbPatients')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24 text-center">
          <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-12 h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.accessGranted.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
            {t('doctor.accessGranted.subtitle')}
          </p>
        </div>
      </div>

      <div className="w-full bg-white border-0 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-3xl">
        <div className="max-w-lg mx-auto">
          <div className="w-full border-2 border-slate-100 rounded-[32px] p-8 bg-slate-50 shadow-sm mb-8">
            {/* Patient Details */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center border-2 border-slate-100 overflow-hidden shrink-0 shadow-sm">
                <HugeiconsIcon icon={UserIcon} className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">{patientName}</h3>
                <p className="text-slate-500 text-base font-bold mt-1">{t('doctor.redeemAccess.patientCode')}: {patientCode}</p>
              </div>
            </div>

            <div className="space-y-0">
              <div className="flex items-center justify-between py-5 border-t-2 border-slate-100 text-base">
                <span className="font-bold text-slate-700">{t('doctor.accessGranted.grantedAt')}</span>
                <span className="font-semibold text-slate-500">{formatDate(grantedAtTime)}</span>
              </div>
              
              <div className="flex items-center justify-between py-5 border-t-2 border-slate-100 text-base">
                <span className="font-bold text-slate-700">{t('doctor.accessGranted.timeLimit')}</span>
                <span className="font-semibold text-slate-500">{calculateTimeLimit(grantedAtTime, expiresAtTime)}</span>
              </div>

              <div className="flex items-center justify-between py-5 border-t-2 border-slate-100 text-base">
                <span className="font-bold text-slate-700">{t('doctor.accessGranted.expiresAt')}</span>
                <span className="font-semibold text-slate-500">{formatDate(expiresAtTime)}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/doctor/patients/workspace/${code}`} className="block w-full">
            <Button 
              fullWidth 
              className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all border-none"
            >
              {t('doctor.accessGranted.goToWorkspace')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
