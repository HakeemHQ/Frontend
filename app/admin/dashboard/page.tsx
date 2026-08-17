"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Calendar01Icon, 
  UserGroupIcon, 
  FileUploadIcon, 
  CheckmarkCircle02Icon, 
  DocumentCodeIcon 
} from "@hugeicons/core-free-icons";

const StatCard = ({
  title,
  value,
  isLoading,
  icon
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
  icon: any;
}) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
      <div className="h-9 w-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
        <HugeiconsIcon icon={icon} className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4">
      {isLoading ? (
        <Spinner className="h-7 w-7 text-primary" />
      ) : (
        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { activitySummary, isActivitySummaryLoading, activitySummaryError, fetchActivitySummary } = useAdminStore();
  
  // Default to last 10 days
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 10);
    return d.toISOString().split("T")[0];
  });
  
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (fromDate > toDate) {
      setDateError(t('admin.dashboard.dateError'));
      return;
    }
    setDateError("");
    fetchActivitySummary({ fromDate, toDate });
  }, [fromDate, toDate, fetchActivitySummary, t]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              {t('admin.dashboard.title')}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 font-medium">
              {t('admin.dashboard.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-white/10 p-2.5 sm:p-3 rounded-xl backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider pl-1">{t('admin.dashboard.from')}</span>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white/20 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <span className="text-white/40 font-bold text-xs">-</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{t('admin.dashboard.toLabel')}</span>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white/20 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div>
        {dateError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 font-bold text-sm">
            {dateError}
          </div>
        )}

        {activitySummaryError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 font-bold text-sm">
            {activitySummaryError}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title={t('admin.dashboard.activeUsers')} 
            value={activitySummary?.activeUsers || 0} 
            isLoading={isActivitySummaryLoading} 
            icon={UserGroupIcon}
          />
          <StatCard 
            title={t('admin.dashboard.documentsUploaded')} 
            value={activitySummary?.documentsUploaded || 0} 
            isLoading={isActivitySummaryLoading} 
            icon={FileUploadIcon}
          />
          <StatCard 
            title={t('admin.dashboard.extractionsCompleted')} 
            value={activitySummary?.extractionsCompleted || 0} 
            isLoading={isActivitySummaryLoading} 
            icon={CheckmarkCircle02Icon}
          />
          <StatCard 
            title={t('admin.dashboard.cvVersionsGenerated')} 
            value={activitySummary?.medicalCvVersionsGenerated || 0} 
            isLoading={isActivitySummaryLoading} 
            icon={DocumentCodeIcon}
          />
        </div>
      </div>
    </div>
  );
}
