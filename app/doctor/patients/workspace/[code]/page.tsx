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

export default function WorkspacePage({ params }: { params: Promise<{ code: string }> }) {
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
    { name: "Overview", active: true, href: `/doctor/patients/workspace/${code}` },
    { name: "Documents", active: false, href: `/doctor/patients/workspace/${code}/documents` },
    { name: "Medical CV", active: false, href: `/doctor/patients/workspace/${code}/medical-cv` },
    { name: "AI Assistant", active: false, href: `/doctor/patients/workspace/${code}/ask-ai` },
  ];

  const quickActions = [
    {
      title: "Upload Document",
      description: "Upload new medical document",
      icon: FileUploadIcon,
      href: `/doctor/patients/workspace/${code}/documents/upload`
    },
    {
      title: "View Documents",
      description: "See all uploaded documents",
      icon: DocumentValidationIcon,
      href: `/doctor/patients/workspace/${code}/documents`
    },
    {
      title: "New Medical CV",
      description: "Generate new medical CV",
      icon: FileAddIcon,
      href: `/doctor/patients/workspace/${code}/medical-cv/new`
    },
    {
      title: "Ask AI Assistant",
      description: "Ask questions about patient data",
      icon: AiChat02Icon,
      href: `/doctor/patients/workspace/${code}/ask-ai`
    },
  ];

  const patientName = accessData?.patient?.fullName || accessData?.fullName || "Patient";

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-900 transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 mr-1.5" />
          <span>Patients</span>
        </Link>
        <span className="mx-3 text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Workspace</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full border border-slate-100/80 rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        {/* Profile Section */}
        <div className="p-8 md:p-10 border-b border-slate-100/80 bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center border border-emerald-100 overflow-hidden shrink-0 shadow-sm">
                <HugeiconsIcon icon={UserIcon} className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{patientName}</h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="text-slate-500 bg-slate-100/80 px-3 py-1 rounded-lg">Code: {code}</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs tracking-wide font-bold uppercase ${isExpired ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isExpired ? 'Access Expired' : 'Active Access'}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm font-semibold text-slate-500 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
              {isExpired ? (
                <span className="text-rose-600 font-bold ml-1 uppercase tracking-wide">Expired</span>
              ) : (
                <>Expires in <span className="text-emerald-600 font-bold ml-2 text-lg tabular-nums">{timeLeft}</span></>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 bg-white/50 backdrop-blur-sm">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-5 px-1 border-b-2 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  tab.active
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
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
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight px-1">Quick Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div 
                className="flex flex-col h-full items-center justify-center text-center p-8 bg-white/80 backdrop-blur-xl border border-slate-100/80 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300 shadow-sm border border-slate-100/50">
                  <HugeiconsIcon icon={action.icon} className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 leading-tight">{action.title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[140px] group-hover:text-slate-600 transition-colors">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
