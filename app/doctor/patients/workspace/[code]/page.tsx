"use client";

import React, { use } from "react";
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

const tabs = [
  { name: "Overview", active: true },
  { name: "Documents", active: false },
  { name: "Medical Records", active: false },
  { name: "Medical CV", active: false },
  { name: "AI Assistant", active: false },
];

const quickActions = [
  {
    title: "Upload Document",
    description: "Upload new medical document",
    icon: FileUploadIcon,
  },
  {
    title: "View Documents",
    description: "See all uploaded documents",
    icon: DocumentValidationIcon,
  },
  {
    title: "New Medical CV",
    description: "Generate new medical CV",
    icon: FileAddIcon,
  },
  {
    title: "Ask AI Assistant",
    description: "Ask questions about patient data",
    icon: AiChat02Icon,
  },
];

export default function WorkspacePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-primary-600">Workspace</span>
      </div>

      <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden">
        {/* Profile Section */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center border border-slate-800 overflow-hidden shrink-0">
                <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-heading mb-1">Mazen Mohamed</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">Code: {code}</span>
                  <span className="font-semibold text-slate-800">Active Access</span>
                </div>
              </div>
            </div>

            <div className="text-sm font-medium text-slate-500 mt-4 sm:mt-0">
              Expires in <span className="text-slate-800 font-bold ml-1 tabular-nums">01:23:45</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8 bg-surface">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition ${
                  tab.active
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center text-center p-8 bg-surface border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition cursor-pointer group"
            >
              <HugeiconsIcon 
                icon={action.icon} 
                className="w-6 h-6 text-slate-800 mb-4 group-hover:-translate-y-1 transition duration-300" 
              />
              <h4 className="font-bold text-slate-900 mb-2 font-heading leading-tight">{action.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[140px]">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
