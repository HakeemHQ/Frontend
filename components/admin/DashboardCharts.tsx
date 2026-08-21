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
  FileUploadIcon,
  UserGroupIcon,
  CheckmarkCircle02Icon,
  Analytics02Icon,
} from "@hugeicons/core-free-icons";

interface DashboardChartsProps {
  activePatients: number;
  activeDoctors: number;
  documentsUploaded: number;
  extractionsCompleted: number;
  medicalCvVersionsGenerated: number;
  isLoading?: boolean;
}

const CustomPipelineTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 space-y-1 z-50">
        <p className="text-slate-400 font-medium text-[11px]">{data.step}</p>
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: data.fill }}
          />
          <span>{data.name}:</span>
          <span className="font-mono text-emerald-400">{data.value.toLocaleString()}</span>
        </p>
        {data.rateLabel && (
          <p className="text-[10px] text-slate-300 pt-0.5 border-t border-slate-800">
            {data.rateLabel}: <span className="font-bold text-white">{data.rateValue}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomUserTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 space-y-1 z-50">
        <p className="text-slate-400 font-medium text-[11px]">{data.role}</p>
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: data.fill }}
          />
          <span>{data.name}:</span>
          <span className="font-mono text-sky-400">{data.value.toLocaleString()}</span>
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

  // Conversion calculations for the Document AI pipeline
  const extractionRate = documentsUploaded > 0 
    ? Math.min(100, Math.round((extractionsCompleted / documentsUploaded) * 100))
    : 0;

  const cvGenerationRate = extractionsCompleted > 0
    ? Math.min(100, Math.round((medicalCvVersionsGenerated / extractionsCompleted) * 100))
    : 0;

  // Pipeline Funnel Chart (Stage-by-stage progression)
  const pipelineData = [
    {
      name: t("admin.dashboard.documentsUploaded") || "Documents Uploaded",
      shortName: t("admin.dashboard.stageUploaded") || "1. Uploaded",
      step: t("admin.dashboard.stage1Desc") || "Stage 1: Ingestion",
      value: documentsUploaded,
      fill: "#3b82f6", // Blue
      rateLabel: t("admin.dashboard.initialInput") || "Initial Input",
      rateValue: "100%",
    },
    {
      name: t("admin.dashboard.extractionsCompleted") || "Extractions Completed",
      shortName: t("admin.dashboard.stageExtracted") || "2. Extracted",
      step: t("admin.dashboard.stage2Desc") || "Stage 2: OCR & Extraction",
      value: extractionsCompleted,
      fill: "#10b981", // Emerald
      rateLabel: t("admin.dashboard.processingRate") || "Processing Rate",
      rateValue: `${extractionRate}% ${t("admin.dashboard.ofUploads") || "of uploads"}`,
    },
    {
      name: t("admin.dashboard.cvVersionsGenerated") || "CV Versions Generated",
      shortName: t("admin.dashboard.stageCvSynthesized") || "3. CV Synthesized",
      step: t("admin.dashboard.stage3Desc") || "Stage 3: Medical CV Synthesis",
      value: medicalCvVersionsGenerated,
      fill: "#8b5cf6", // Purple
      rateLabel: t("admin.dashboard.conversionRate") || "CV Conversion Rate",
      rateValue: `${cvGenerationRate}% ${t("admin.dashboard.ofExtractions") || "of extractions"}`,
    },
  ];

  // User Base Demographics
  const totalActiveUsers = activePatients + activeDoctors;
  const patientPercentage = totalActiveUsers > 0 ? Math.round((activePatients / totalActiveUsers) * 100) : 0;
  const doctorPercentage = totalActiveUsers > 0 ? Math.round((activeDoctors / totalActiveUsers) * 100) : 0;

  const userBaseData = [
    {
      name: t("admin.dashboard.activePatients") || "Active Patients",
      role: t("admin.dashboard.activePatientsLabel") || "Patients",
      value: activePatients,
      fill: "#0ea5e9", // Sky blue
    },
    {
      name: t("admin.dashboard.activeDoctors") || "Active Doctors",
      role: t("admin.dashboard.activeDoctorsLabel") || "Doctors",
      value: activeDoctors,
      fill: "#f59e0b", // Amber
    },
  ].filter((d) => d.value > 0);

  // Formatted summaries
  const docProcessedText = (t("admin.dashboard.docsProcessedSummary") || "{count} of {total} documents processed")
    .replace("{count}", extractionsCompleted.toLocaleString())
    .replace("{total}", documentsUploaded.toLocaleString());

  const cvGeneratedText = (t("admin.dashboard.cvGeneratedSummary") || "{count} versions from {total} extractions")
    .replace("{count}", medicalCvVersionsGenerated.toLocaleString())
    .replace("{total}", extractionsCompleted.toLocaleString());

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-7 h-80 rounded-2xl bg-white border border-slate-100 animate-pulse" />
        <div className="lg:col-span-5 h-80 rounded-2xl bg-white border border-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document AI Pipeline Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={FileUploadIcon} className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    {t("admin.dashboard.pipelineFunnelTitle") || "Document AI Pipeline Funnel"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {t("admin.dashboard.pipelineFunnelSubtitle") || "Uploads → Extractions → CV Generations"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stage Flow Badges */}
            <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="text-center">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {t("admin.dashboard.stageUploaded") || "1. Uploaded"}
                </span>
                <span className="text-sm sm:text-base font-black text-blue-600 font-heading tabular-nums">
                  {documentsUploaded.toLocaleString()}
                </span>
              </div>
              <div className="text-center border-x border-slate-200/60 px-1">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {t("admin.dashboard.stageExtracted") || "2. Extracted"}
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-600 font-heading tabular-nums">
                  {extractionsCompleted.toLocaleString()}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {t("admin.dashboard.stageCvSynthesized") || "3. CV Synthesized"}
                </span>
                <span className="text-sm sm:text-base font-black text-purple-600 font-heading tabular-nums">
                  {medicalCvVersionsGenerated.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full min-w-0">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipelineData}
                  margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="shortName" 
                    tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    interval={0}
                    height={30}
                  />
                  <YAxis 
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={35}
                  />
                  <Tooltip content={<CustomPipelineTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`pipe-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* User Base Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={UserGroupIcon} className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    {t("admin.dashboard.userDistributionTitle") || "Active User Base"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {t("admin.dashboard.userDistributionSubtitle") || "Patients vs Doctors"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 shrink-0">
                {totalActiveUsers.toLocaleString()} {t("admin.dashboard.users") || "Users"}
              </span>
            </div>
          </div>

          <div className="min-h-[14rem] w-full flex flex-col xl:flex-row items-center justify-center gap-6 py-2">
            {isLoading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : totalActiveUsers > 0 ? (
              <>
                {/* Donut graphic */}
                <div className="h-40 w-40 shrink-0 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={userBaseData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {userBaseData.map((entry, index) => (
                          <Cell key={`user-cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomUserTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-slate-900 font-heading leading-none">
                      {totalActiveUsers}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                      {t("admin.dashboard.users") || "Users"}
                    </span>
                  </div>
                </div>

                {/* User Cards Breakdown */}
                <div className="flex-1 w-full space-y-3 min-w-0">
                  {/* Patients item */}
                  <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">
                          {t("admin.dashboard.activePatients") || "Active Patients"}
                        </span>
                      </div>
                      <span className="text-sm font-black text-sky-700 font-mono tabular-nums shrink-0">
                        {patientPercentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[11px] font-medium text-slate-400">
                        {t("admin.dashboard.totalRegistered") || "Total Registered"}
                      </span>
                      <span className="font-bold text-slate-700 font-mono">
                        {activePatients.toLocaleString()} {t("admin.dashboard.accounts") || "accounts"}
                      </span>
                    </div>
                  </div>

                  {/* Doctors item */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">
                          {t("admin.dashboard.activeDoctors") || "Active Doctors"}
                        </span>
                      </div>
                      <span className="text-sm font-black text-amber-700 font-mono tabular-nums shrink-0">
                        {doctorPercentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[11px] font-medium text-slate-400">
                        {t("admin.dashboard.totalRegistered") || "Total Registered"}
                      </span>
                      <span className="font-bold text-slate-700 font-mono">
                        {activeDoctors.toLocaleString()} {t("admin.dashboard.accounts") || "accounts"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-slate-400 py-12">
                {t("admin.dashboard.noActivityData") || "No user data in selected period"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Efficiency KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Extraction Completion Rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-snug">
                  {t("admin.dashboard.docExtractionSuccess") || "Document Extraction Success"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {docProcessedText}
              </p>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading tabular-nums shrink-0 self-start">
              {extractionRate}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${extractionRate}%` }}
            />
          </div>
        </div>

        {/* CV Generation Pipeline Rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Analytics02Icon} className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-snug">
                  {t("admin.dashboard.cvSynthesisConversion") || "CV Synthesis Conversion"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cvGeneratedText}
              </p>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading tabular-nums shrink-0 self-start">
              {cvGenerationRate}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${cvGenerationRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


