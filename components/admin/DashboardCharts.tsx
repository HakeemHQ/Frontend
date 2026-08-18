"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ChartBarLineIcon, 
  PieChartIcon, 
  CheckmarkCircle02Icon,
  Analytics02Icon
} from "@hugeicons/core-free-icons";

interface DashboardChartsProps {
  activePatients: number;
  activeDoctors: number;
  documentsUploaded: number;
  extractionsCompleted: number;
  medicalCvVersionsGenerated: number;
  isLoading?: boolean;
}

const COLORS = [
  "#2563eb", // Primary blue (Uploads)
  "#10b981", // Emerald (Extractions)
  "#6366f1", // Indigo (CV Versions)
  "#0ea5e9", // Sky (Active Patients)
  "#f59e0b", // Amber (Active Doctors)
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-slate-800 space-y-1">
        <p className="text-slate-400 font-medium">{label || payload[0].name}</p>
        <p className="text-sm font-bold text-white flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: payload[0].color || payload[0].payload.fill }}
          />
          {payload[0].value.toLocaleString()} items
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({
  activePatients,
  activeDoctors,
  documentsUploaded,
  extractionsCompleted,
  medicalCvVersionsGenerated,
  isLoading,
}: DashboardChartsProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const barData = [
    {
      name: t('admin.dashboard.documentsUploaded') || "Documents",
      value: documentsUploaded,
      fill: "#2563eb",
    },
    {
      name: t('admin.dashboard.extractionsCompleted') || "Extractions",
      value: extractionsCompleted,
      fill: "#10b981",
    },
    {
      name: t('admin.dashboard.cvVersionsGenerated') || "CV Versions",
      value: medicalCvVersionsGenerated,
      fill: "#6366f1",
    },
    {
      name: t('admin.dashboard.activePatients') || "Patients",
      value: activePatients,
      fill: "#0ea5e9",
    },
    {
      name: t('admin.dashboard.activeDoctors') || "Doctors",
      value: activeDoctors,
      fill: "#f59e0b",
    },
  ];

  const totalActivity = documentsUploaded + extractionsCompleted + medicalCvVersionsGenerated + activePatients + activeDoctors;

  const pieData = [
    { name: t('admin.dashboard.documentsUploaded') || "Documents", value: documentsUploaded, fill: "#2563eb" },
    { name: t('admin.dashboard.extractionsCompleted') || "Extractions", value: extractionsCompleted, fill: "#10b981" },
    { name: t('admin.dashboard.cvVersionsGenerated') || "CV Versions", value: medicalCvVersionsGenerated, fill: "#6366f1" },
    { name: t('admin.dashboard.activePatients') || "Patients", value: activePatients, fill: "#0ea5e9" },
    { name: t('admin.dashboard.activeDoctors') || "Doctors", value: activeDoctors, fill: "#f59e0b" },
  ].filter(d => d.value > 0);

  // Pipeline conversion calculations
  const extractionRate = documentsUploaded > 0 
    ? Math.min(100, Math.round((extractionsCompleted / documentsUploaded) * 100))
    : 0;

  const cvGenerationRate = extractionsCompleted > 0
    ? Math.min(100, Math.round((medicalCvVersionsGenerated / extractionsCompleted) * 100))
    : 0;

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-7 h-72 rounded-2xl bg-white border border-slate-100 animate-pulse"></div>
        <div className="lg:col-span-5 h-72 rounded-2xl bg-white border border-slate-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Activity Volume */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <HugeiconsIcon icon={ChartBarLineIcon} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                  Activity Volume Comparison
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Metrics comparison for selected date range
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
              Total: {totalActivity.toLocaleString()}
            </span>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie / Donut Chart: Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HugeiconsIcon icon={PieChartIcon} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                  Workload Distribution
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Percentage share per activity
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pieData.length > 0 ? (
              <>
                <div className="h-44 w-44 shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-black text-slate-900 font-heading leading-none">
                      {totalActivity}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                      Total
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 mt-4 sm:mt-0 sm:ml-4 w-full">
                  {pieData.map((item, idx) => {
                    const percentage = totalActivity > 0 ? Math.round((item.value / totalActivity) * 100) : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                          <span className="font-semibold text-slate-700 truncate">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 ml-2">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-slate-400 py-12">
                No activity data to visualize
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Efficiency KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Extraction Completion Rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Document Extraction Success
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {extractionsCompleted} of {documentsUploaded} documents processed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${extractionRate}%` }}
              />
            </div>
            <span className="text-lg font-black text-slate-900 font-heading tabular-nums">
              {extractionRate}%
            </span>
          </div>
        </div>

        {/* CV Generation Pipeline Rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Analytics02Icon} className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CV Synthesis Conversion
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {medicalCvVersionsGenerated} versions from {extractionsCompleted} extractions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cvGenerationRate}%` }}
              />
            </div>
            <span className="text-lg font-black text-slate-900 font-heading tabular-nums">
              {cvGenerationRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
