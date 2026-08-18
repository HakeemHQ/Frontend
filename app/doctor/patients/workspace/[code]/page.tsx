"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  UserIcon,
  FileUploadIcon,
  DocumentValidationIcon,
  FileAddIcon,
  AiChat02Icon
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

export default function WorkspacePage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const { code } = use(params);
  
  const [accessData, setAccessData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const data = sessionStorage.getItem(`access_${code}`);
    if (data) {
      try {
        setAccessData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse access data");
      }
    }
  }, [code]);

  useEffect(() => {
    if (!accessData?.expiresAt) {
      setTimeLeft("--:--:--");
      return;
    }

    const updateTimer = () => {
      let expiryString = accessData.expiresAt;
      if (typeof expiryString === 'string' && !expiryString.endsWith('Z')) {
        expiryString += 'Z';
      }
      const now = new Date().getTime();
      const expires = new Date(expiryString).getTime();
      const distance = expires - now;

      if (distance <= 0) {
        setTimeLeft("00:00:00");
        setIsExpired(true);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [accessData?.expiresAt]);

  const tabs = [
    { name: t('doctor.workspace.overview'), active: true, href: `/doctor/patients/workspace/${code}` },
    { name: t('doctor.workspace.documents'), active: false, href: `/doctor/patients/workspace/${code}/documents` },
    { name: t('doctor.workspace.medicalCvs'), active: false, href: `/doctor/patients/workspace/${code}/medical-cv` },
    { name: t('doctor.workspace.askAi'), active: false, href: `/doctor/patients/workspace/${code}/ask-ai` },
  ];

  const quickActions = [
    {
      title: t('doctor.documents.upload'),
      description: t('doctor.workspace.uploadDesc'),
      icon: FileUploadIcon,
      href: `/doctor/patients/workspace/${code}/documents/upload`
    },
    {
      title: t('doctor.workspace.documents'),
      description: t('doctor.workspace.documentsDesc'),
      icon: DocumentValidationIcon,
      href: `/doctor/patients/workspace/${code}/documents`
    },
    {
      title: t('doctor.medicalCvs.generateNew'),
      description: t('doctor.workspace.medicalCvsDesc'),
      icon: FileAddIcon,
      href: `/doctor/patients/workspace/${code}/medical-cv/new`
    },
    {
      title: t('doctor.workspace.askAi'),
      description: t('doctor.workspace.askAiDesc'),
      icon: AiChat02Icon,
      href: `/doctor/patients/workspace/${code}/ask-ai`
    },
  ];

  const patientName = accessData?.patient?.fullName || accessData?.fullName || "Patient";

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full rounded-3xl overflow-hidden shadow-sm"
      >
        {/* Compact Hero Section for Patient Workspace */}
        <div className="bg-primary p-6 sm:p-8 text-white relative shadow-xl shadow-primary/20 min-h-[160px]">
          <div className="absolute inset-0 rounded-t-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 opacity-10 text-white transform -rotate-12">
              <HugeiconsIcon icon={UserIcon} className="w-[360px] h-[360px]" />
            </div>
          </div>

          {/* Back Navigation */}
          <div className="relative z-20 mb-4">
            <Link 
              href="/doctor/patients"
              className="inline-flex items-center text-xs font-semibold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg backdrop-blur-md"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
              {t('doctor.workspace.breadcrumbPatients')}
            </Link>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading leading-tight">{patientName}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
                  {t('doctor.workspace.patientCode')}: <span className="font-mono">{code}</span>
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${isExpired ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-900'}`}>
                  {isExpired ? t('doctor.workspace.sessionExpired') : t('doctor.workspace.activeAccess')}
                </span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 flex flex-col items-center shrink-0">
              {isExpired ? (
                <span className="text-rose-200 uppercase tracking-wider text-xs font-bold">{t('doctor.workspace.expired')}</span>
              ) : (
                <>
                  <span className="text-white/70 uppercase tracking-wider text-[10px] font-semibold">{t('doctor.workspace.sessionExpires')}</span>
                  <span className="text-white text-lg sm:text-xl font-mono font-bold">{timeLeft}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 bg-white border border-slate-100 border-t-0 rounded-b-3xl">
          <nav className="flex gap-6 sm:gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-3.5 px-1 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="space-y-3"
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {t('doctor.patients.actions') || "Quick Actions"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="group">
              <div className="flex flex-col h-full items-center text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  <HugeiconsIcon icon={action.icon} className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-primary transition-colors">{action.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
