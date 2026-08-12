"use client";

import React, { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  UserIcon
} from "@hugeicons/core-free-icons";

export default function AccessGrantedPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  // Formatting dates to match the UI screenshot
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative animate-in fade-in duration-300">
      {/* Header Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">Access Granted</span>
      </div>

      <div className="flex flex-col items-center mt-12 mb-8">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-16 h-16 text-[#008060] mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-[#008060] mb-2 font-heading">
          Access Granted
        </h1>
        <p className="text-slate-500 text-sm text-center">
          You now have access to the patient's medical data.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="w-full border border-slate-100 rounded-2xl p-6 bg-surface shadow-sm mb-6">
          {/* Patient Details */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 font-heading">Mazen Mohamed</h3>
              <p className="text-slate-500 text-sm">Patient Code: {code}</p>
            </div>
          </div>

          <div className="space-y-0">
            <div className="flex items-center justify-between py-4 border-t border-slate-100 text-sm">
              <span className="font-semibold text-slate-700">Access Granted At</span>
              <span className="text-slate-500">{formatDate(now)}</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-t border-slate-100 text-sm">
              <span className="font-semibold text-slate-700">Time limit</span>
              <span className="text-slate-500">24 hours</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-slate-100 text-sm">
              <span className="font-semibold text-slate-700">Access Expires At</span>
              <span className="text-slate-500">{formatDate(expiresAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          fullWidth 
          className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
        >
          Go to Patient Workspace
        </Button>
      </div>
    </div>
  );
}
