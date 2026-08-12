"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Search01Icon,
  UserIdVerificationIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Alert01Icon
} from "@hugeicons/core-free-icons";

export default function VerifyIdentityPage() {
  const [patientCode, setPatientCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleVerify = () => {
    if (!patientCode || !nationalId) {
      showToast("Please enter both patient code and national ID.", "warning");
      return;
    }

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      if (patientCode.toLowerCase() === "error") {
        setStatus("idle");
        showToast("Failed to verify patient identity. The provided code or ID does not match our records.", "error");
      } else {
        setStatus("success");
        showToast("Patient identity successfully verified.", "success");
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative">
      {/* Generic Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`border rounded-xl p-4 shadow-lg flex items-start gap-3 max-w-md ${
            toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
            toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
            "bg-amber-50 border-amber-200 text-amber-900"
          }`}>
            <div className="mt-0.5">
              {toast.type === "error" && <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 text-red-600" />}
              {toast.type === "success" && <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-5 h-5 text-green-600" />}
              {toast.type === "warning" && <HugeiconsIcon icon={Alert01Icon} className="w-5 h-5 text-amber-600" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-semibold ${
                toast.type === "error" ? "text-red-800" :
                toast.type === "success" ? "text-green-800" :
                "text-amber-900"
              }`}>
                {toast.type === "error" ? "Verification Failed" : toast.type === "success" ? "Verification Successful" : "Warning"}
              </h3>
              <p className={`text-sm mt-1 ${
                toast.type === "error" ? "text-red-700" :
                toast.type === "success" ? "text-green-700" :
                "text-amber-800"
              }`}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className={`transition ${
              toast.type === "error" ? "text-red-500 hover:text-red-700" :
              toast.type === "success" ? "text-green-500 hover:text-green-700" :
              "text-amber-500 hover:text-amber-700"
            }`}>
              <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">Verify Identity</span>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center max-w-lg mt-12 mx-auto animate-in fade-in zoom-in-95 duration-500">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-16 h-16 text-[#008060] mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-[#008060] mb-2">
            Identity Verified
          </h1>
          <p className="text-slate-500 text-sm mb-8 text-center">
            The patient identity has been successfully verified.
          </p>

          <div className="w-full border border-slate-100 rounded-2xl p-6 bg-white shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Patient Code</p>
                <p className="font-medium text-slate-900">{patientCode || "H89K-27P"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Patient Name</p>
                <p className="font-medium text-slate-900">Mazen Mohamed</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <p className="font-medium text-[#008060]">Verified</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Verified At</p>
                <p className="font-medium text-slate-900 text-sm">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          <Button fullWidth className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm">
            Request Access
          </Button>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Verify Patient Identity
            </h1>
            <p className="text-slate-500 text-sm">
              Enter the patient code and verify the national ID from the physical card.
            </p>
          </div>

          <div className="space-y-6 max-w-lg mt-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="p-code">
                Patient Code
              </label>
              <Input
                placeholder="H89K-27P"
                iconLeft={<HugeiconsIcon icon={Search01Icon} className="h-5 w-5 text-slate-400" />}
                id="p-code"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="n-id">
                National ID
              </label>
              <Input
                placeholder="3000512X00000X"
                iconLeft={<HugeiconsIcon icon={UserIdVerificationIcon} className="h-5 w-5 text-slate-400" />}
                id="n-id"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleVerify}
                disabled={status === "loading"}
                fullWidth 
                className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
              >
                {status === "loading" ? "Verifying..." : "Verify Identity"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
