"use client";

import React from "react";
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

export default function VerifyIdentityPage() {
  return (
    <div className="max-w-2xl mx-auto pt-4 pb-8 space-y-6">
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/doctor/patients" className="flex items-center hover:text-slate-800 transition">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-slate-900">Verify Identity</span>
      </div>

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
          <label className="text-sm font-semibold text-slate-900">
            Patient Code
          </label>
          <Input
            placeholder="H89K-27P"
            iconLeft={<SearchIcon className="h-5 w-5 text-slate-400" />}
            className="shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            National ID
          </label>
          <Input
            placeholder="3000512X00000X"
            iconLeft={<IdCardIcon className="h-5 w-5 text-slate-400" />}
            className="shadow-sm"
          />
        </div>

        <div className="pt-4">
          <Button fullWidth className="bg-[#008060] hover:bg-[#006e52] text-white border-0 py-4 text-base font-semibold shadow-sm">
            Verify Identity
          </Button>
        </div>
      </div>
    </div>
  );
}
