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

export default function WorkspacePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  const tabs = [
    { name: "Overview", active: true, href: `/doctor/patients/workspace/${code}` },
    { name: "Documents", active: false, href: `/doctor/patients/workspace/${code}/documents` },
    { name: "Medical Records", active: false, href: `/doctor/patients/workspace/${code}/medical-records` },
    { name: "Medical CV", active: false, href: `/doctor/patients/workspace/${code}/medical-cv` },
    { name: "AI Assistant", active: false, href: `/doctor/ask-ai` },
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
      href: `/doctor/patients/workspace/${code}/medical-cv`
    },
    {
      title: "Ask AI Assistant",
      description: "Ask questions about patient data",
      icon: AiChat02Icon,
      href: `/doctor/ask-ai`
    },
  ];

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
              <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 overflow-hidden shrink-0">
                <HugeiconsIcon icon={UserIcon} className="w-10 h-10 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-heading mb-1">Mazen Mohamed</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">Code: {code}</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-md font-medium text-xs">
                    Active Access
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Expires in <span className="text-primary-600 font-bold ml-1 tabular-nums">01:23:45</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8 bg-surface">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition ${
                  tab.active
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div 
                className="flex flex-col h-full items-center justify-center text-center p-8 bg-surface border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary-100 transition duration-300">
                  <HugeiconsIcon icon={action.icon} className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 font-heading leading-tight">{action.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[140px]">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
