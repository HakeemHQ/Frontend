"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const logs = [
  { id: 1, time: "10 Aug 2026 16:55", actor: "Dr. Ahmed Hassan", action: "ExtractedItemReviewed", target: "ExtractedItem: ext_123" },
  { id: 2, time: "10 Aug 2026 16:40", actor: "Dr. Sara Ali", action: "DocumentUploaded", target: "Document: doc_456" },
  { id: 3, time: "10 Aug 2026 16:35", actor: "System", action: "PatientAccessGranted", target: "Patient: pat_789" },
  { id: 4, time: "10 Aug 2026 16:10", actor: "Admin", action: "DoctorStatusChanged", target: "Doctor: doc_101" },
];

const actionOptions = [
  { value: "all", label: "All" },
  { value: "reviewed", label: "ExtractedItemReviewed" },
  { value: "uploaded", label: "DocumentUploaded" },
  { value: "granted", label: "PatientAccessGranted" },
  { value: "changed", label: "DoctorStatusChanged" },
];

const actorOptions = [
  { value: "all", label: "All" },
  { value: "system", label: "System" },
  { value: "admin", label: "Admin" },
  { value: "doctors", label: "Doctors" },
];

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold tracking-tight">
          A7
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">
          Audit Logs
        </h1>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row items-end justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-end gap-4 w-full xl:w-auto">
            <div className="space-y-1.5 w-full sm:w-48 z-20">
              <label className="text-sm font-medium text-slate-700">Action</label>
              <Select 
                options={actionOptions}
                value={actionFilter}
                onChange={setActionFilter}
              />
            </div>
            <div className="space-y-1.5 w-full sm:w-48 z-10">
              <label className="text-sm font-medium text-slate-700">Actor</label>
              <Select 
                options={actorOptions}
                value={actorFilter}
                onChange={setActorFilter}
              />
            </div>
            
            <div className="w-full sm:w-[280px]">
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 cursor-pointer">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarIcon className="text-slate-400" />
                  <span className="text-slate-700 font-medium">Aug 1, 2026 - Aug 10, 2026</span>
                </div>
                <ChevronRightIcon className="text-slate-400" />
              </div>
            </div>
          </div>

          <div className="w-full xl:w-80">
            <Input
              placeholder="Search logs"
              iconLeft={<SearchIcon className="h-4 w-4" />}
              className="bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{log.time}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{log.actor}</td>
                  <td className="whitespace-nowrap px-6 py-4">{log.action}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-1 pt-6">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <ChevronLeftIcon />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
            1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            3
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
