"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLanguage } from "@/localization/LanguageContext";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  UserIcon,
  Clock01Icon
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
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary"></div>
      </div>
    );
  }

  const grantedAtTime = accessData?.grantedAt || new Date().toISOString();
  const expiresAtTime = accessData?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const patientName = accessData?.patient?.fullName || "Patient";
  const patientCode = accessData?.patient?.patientCode || code;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/doctor/patients" className="inline-flex items-center gap-1 transition hover:text-primary">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('doctor.accessGranted.breadcrumbPatients')}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{t('doctor.accessGranted.title')}</span>
      </nav>

      {/* Access Granted Card */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3.5 pb-5 mb-5 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading">
              {t('doctor.accessGranted.title')}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              {t('doctor.accessGranted.subtitle')}
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
                <h3 className="text-sm font-bold text-slate-900">{patientName}</h3>
                <span className="text-xs text-slate-500 font-medium">Code: <span className="font-mono font-bold text-slate-700">{patientCode}</span></span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              Active Session
            </span>
          </div>

          {/* Timing details */}
          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="font-semibold text-slate-500">{t('doctor.accessGranted.grantedAt')}</span>
              <span className="font-medium text-slate-900">{formatDate(grantedAtTime)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="font-semibold text-slate-500">{t('doctor.accessGranted.timeLimit')}</span>
              <span className="font-bold text-primary">{calculateTimeLimit(grantedAtTime, expiresAtTime)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="font-semibold text-slate-500">{t('doctor.accessGranted.expiresAt')}</span>
              <span className="font-medium text-slate-900">{formatDate(expiresAtTime)}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 mt-6">
            <Link href={`/doctor/patients/workspace/${code}`} className="block w-full">
              <Button fullWidth className="py-2.5 text-sm font-semibold">
                {t('doctor.accessGranted.goToWorkspace')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
