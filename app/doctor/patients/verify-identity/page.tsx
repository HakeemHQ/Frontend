"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IdCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M7 15h10M7 11h4" />
    <circle cx="16" cy="11" r="2" />
  </svg>
);

const CheckCircleFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function VerifyIdentityPage() {
  const [patientCode, setPatientCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleVerify = () => {
    if (!patientCode || !nationalId) {
      setErrorToast("Please enter both patient code and national ID.");
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      // Dummy logic for error state
      if (patientCode.toLowerCase() === "error") {
        setStatus("idle");
        setErrorToast("Failed to verify patient identity. The provided code or ID does not match our records.");
        setTimeout(() => setErrorToast(null), 5000);
      } else {
        setStatus("success");
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6 relative">
      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 shadow-lg flex items-start gap-3 max-w-md">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Verification Failed</h3>
              <p className="text-sm text-red-700 mt-1">{errorToast}</p>
            </div>
            <button onClick={() => setErrorToast(null)} className="text-red-500 hover:text-red-700 transition">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">Verify Identity</span>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center max-w-lg mt-12 mx-auto animate-in fade-in zoom-in-95 duration-500">
          <CheckCircleFilledIcon className="w-16 h-16 text-[#008060] mb-4" />
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
                iconLeft={<SearchIcon className="h-5 w-5 text-slate-400" />}
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
                iconLeft={<IdCardIcon className="h-5 w-5 text-slate-400" />}
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
