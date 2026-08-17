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
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full rounded-[48px] overflow-hidden relative"
      >
        {/* Massive Hero Section for Profile */}
        <div className="bg-primary p-6 sm:p-10 lg:p-16 lg:p-20 shadow-2xl shadow-primary/40 relative overflow-hidden text-white min-h-[350px]">
          {/* Background Graphic */}
          <div className="absolute -top-20 -right-20 opacity-10 text-white transform -rotate-12">
            <HugeiconsIcon icon={UserIcon} className="w-[600px] h-[600px]" />
          </div>

          {/* Back Navigation */}
          <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
            <Link 
              href="/doctor/patients"
              className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('doctor.workspace.breadcrumbPatients')}
            </Link>
          </div>

          <div className="relative z-10 mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl lg:text-8xl font-black text-white tracking-tighter font-heading mb-4 leading-[1.1]">{patientName}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg font-bold">
                <span className="text-white/80 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                  {t('doctor.workspace.patientCode')}: {code}
                </span>
                <div className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wide font-bold uppercase shadow-lg ${isExpired ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-900'}`}>
                  {isExpired ? t('doctor.workspace.sessionExpired') : t('doctor.workspace.activeAccess')}
                </div>
              </div>
            </div>

            <div className="text-base font-bold bg-white/20 backdrop-blur-md px-8 py-4 rounded-[24px] shadow-lg border border-white/20 flex flex-col items-center">
              {isExpired ? (
                <span className="text-rose-300 uppercase tracking-widest">{t('doctor.workspace.expired')}</span>
              ) : (
                <>
                  <span className="text-white/70 uppercase tracking-wider text-xs mb-1">{t('doctor.workspace.sessionExpires')}</span>
                  <span className="text-white text-3xl font-black tabular-nums font-heading tracking-tight">{timeLeft}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-b-[48px] relative z-20">
          <nav className="flex space-x-12 rtl:space-x-reverse overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-8 px-2 border-b-4 text-lg font-bold whitespace-nowrap transition-all duration-300 ${
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-900 hover:border-slate-300"
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tighter mb-8 px-2 mt-8">
          {t('doctor.patients.actions') || "Quick Actions"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="group">
              <div 
                className="flex flex-col h-full items-center justify-center text-center p-10 bg-white border-0 rounded-[40px] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-md">
                  <HugeiconsIcon icon={action.icon} className="w-10 h-10" />
                </div>
                <h4 className="font-black text-2xl text-slate-900 font-heading mb-3 leading-tight tracking-tight">{action.title}</h4>
                <p className="text-base font-bold text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
