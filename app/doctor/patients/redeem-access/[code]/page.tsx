"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  UserIcon
} from "@hugeicons/core-free-icons";

export default function RedeemAccessPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [oneTimeCode, setOneTimeCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const handleRedeem = () => {
    if (!oneTimeCode || oneTimeCode.length < 6) {
      setToast({ message: "Please enter a valid 6-digit one-time code.", type: "warning" });
      return;
    }

    setIsRedeeming(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsRedeeming(false);
      if (oneTimeCode === "000000") {
        setToast({ message: "Invalid or expired code.", type: "error" });
      } else {
        setToast({ 
          message: "Access successfully redeemed! You can now view the patient's data.", 
          type: "success" 
        });
      }
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
        <span className="font-medium text-slate-900">Redeem Access</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Redeem Access Code
        </h1>
        <p className="text-slate-500 text-sm">
          Enter the one-time code provided by the patient.
        </p>
      </div>

      <div className="max-w-lg mt-8">
        <div className="w-full border border-slate-100 rounded-2xl p-6 bg-white shadow-sm mb-6 transition-all hover:shadow-md">
          {/* Patient Details */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              {/* Fallback avatar */}
              <HugeiconsIcon icon={UserIcon} className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Mazen Mohamed</h3>
              <p className="text-slate-500 text-sm">Patient Code: {code}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="ot-code">
              One-Time Code
            </label>
            <Input
              id="ot-code"
              placeholder="482913"
              value={oneTimeCode}
              onChange={(e) => setOneTimeCode(e.target.value)}
              maxLength={6}
              className="font-medium tracking-widest"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleRedeem}
          disabled={isRedeeming}
          fullWidth 
          className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm transition"
        >
          {isRedeeming ? "Redeeming Code..." : "Redeem Code"}
        </Button>
      </div>
    </div>
  );
}
