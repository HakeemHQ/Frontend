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
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-500 mb-4">{title}</h3>
    <div className="flex items-end gap-3 mb-2 h-10">
      {isLoading ? (
        <Spinner className="h-6 w-6 text-slate-400" />
      ) : (
        <span className="text-4xl font-bold text-slate-900">{value}</span>
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
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t('admin.dashboard.title')}
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-40"
            />
            <span className="text-slate-400">{t('admin.dashboard.to')}</span>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </div>
      
      {dateError && (
        <div className="text-sm text-red-500">
          {dateError}
        </div>
      )}

      {activitySummaryError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
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
  );
}
