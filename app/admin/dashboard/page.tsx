"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const StatCard = ({
  title,
  value,
  isLoading
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <div className="rounded-[40px] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-56 transition-transform hover:-translate-y-2">
    <h3 className="text-lg font-bold text-slate-500">{title}</h3>
    <div className="flex items-end gap-3 mt-4">
      {isLoading ? (
        <Spinner className="h-10 w-10 text-primary" />
      ) : (
        <span className="text-6xl font-black text-slate-900 tracking-tighter">{value}</span>
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
  }, [fromDate, toDate, fetchActivitySummary]);

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[350px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <CalendarIcon />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 font-heading">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-xl text-white/80 font-medium">{t('admin.dashboard.subtitle')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex flex-col w-full sm:w-auto">
                <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2">{t('admin.dashboard.from')}</span>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none w-full sm:w-48 placeholder-white/50"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <span className="text-white/40 font-bold mt-6 hidden sm:block">{t('admin.dashboard.to')}</span>
              <div className="flex flex-col w-full sm:w-auto">
                <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2">{t('admin.dashboard.toLabel')}</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none w-full sm:w-48 placeholder-white/50"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section overlapping the hero slightly */}
      <div className="-mt-16 relative z-20 px-4 md:px-8">
        {dateError && (
          <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-6 text-red-600 font-bold shadow-xl shadow-red-500/10 text-lg">
            {dateError}
          </div>
        )}

        {activitySummaryError && (
          <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-6 text-red-600 font-bold shadow-xl shadow-red-500/10 text-lg">
            {activitySummaryError}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title={t('admin.dashboard.activeUsers')} value={activitySummary?.activeUsers || 0} isLoading={isActivitySummaryLoading} />
          <StatCard title={t('admin.dashboard.documentsUploaded')} value={activitySummary?.documentsUploaded || 0} isLoading={isActivitySummaryLoading} />
          <StatCard title={t('admin.dashboard.extractionsCompleted')} value={activitySummary?.extractionsCompleted || 0} isLoading={isActivitySummaryLoading} />
          <StatCard title={t('admin.dashboard.cvVersionsGenerated')} value={activitySummary?.medicalCvVersionsGenerated || 0} isLoading={isActivitySummaryLoading} />
        </div>
      </div>
    </div>
  );
}
