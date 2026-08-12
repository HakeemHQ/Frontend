"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  InformationCircleIcon,
  UserIcon
} from "@hugeicons/core-free-icons";

export default function RequestAccessPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const handleRequestAccess = () => {
    setIsSending(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSending(false);
      router.push(`/doctor/patients/redeem-access/${code}`);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">Request Access</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Request Access
        </h1>
        <p className="text-slate-500 text-sm">
          You are requesting access to this patient's medical data.
        </p>
      </div>

      <div className="max-w-lg mt-8">
        <div className="w-full border border-slate-100 rounded-2xl p-6 bg-white shadow-sm mb-6 transition-all hover:shadow-md">
          {/* Patient Details */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              {/* Fallback avatar since we don't have the explicit image asset */}
              <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Mazen Mohamed</h3>
              <p className="text-slate-500 text-sm">Patient Code: {code}</p>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              The patient will receive a request on their mobile app.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleRequestAccess}
          disabled={isSending}
          fullWidth 
          className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
        >
          {isSending ? "Sending Request..." : "Send Request"}
        </Button>
      </div>
    </div>
  );
}
