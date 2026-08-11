"use client";

import React from "react";
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

const data = [
  { name: "Aug 1", documents: 30, extractions: 10 },
  { name: "Aug 2", documents: 20, extractions: 15 },
  { name: "Aug 3", documents: 40, extractions: 20 },
  { name: "Aug 4", documents: 30, extractions: 18 },
  { name: "Aug 5", documents: 50, extractions: 25 },
  { name: "Aug 6", documents: 60, extractions: 35 },
  { name: "Aug 7", documents: 40, extractions: 20 },
  { name: "Aug 8", documents: 55, extractions: 30 },
  { name: "Aug 9", documents: 70, extractions: 40 },
  { name: "Aug 10", documents: 80, extractions: 45 },
];

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
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-500 mb-4">{title}</h3>
    <div className="flex items-end gap-3 mb-2">
      <span className="text-4xl font-bold text-slate-900">{value}</span>
      <span className={`text-sm font-semibold mb-1 ${trendUp ? "text-emerald-500" : "text-red-500"}`}>
        {trendUp ? "+" : ""}{trend}
      </span>
    </div>
    <p className="text-xs text-slate-400">vs previous 10 days</p>
  </div>
);

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
          <span>Aug 1, 2026 - Aug 10, 2026</span>
          <CalendarIcon />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Patients" value="84" trend="12%" trendUp={true} />
        <StatCard title="Active Doctors" value="12" trend="9%" trendUp={true} />
        <StatCard title="Documents Uploaded" value="231" trend="18%" trendUp={true} />
        <StatCard title="Extractions Completed" value="218" trend="14%" trendUp={true} />
        <StatCard title="CV Versions Generated" value="47" trend="8%" trendUp={true} />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Activity Overview <span className="text-sm font-normal text-slate-500">(Last 10 Days)</span>
          </h2>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748B", fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748B", fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Line
                type="monotone"
                dataKey="documents"
                name="Documents"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="extractions"
                name="Extractions"
                stroke="#60A5FA"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
