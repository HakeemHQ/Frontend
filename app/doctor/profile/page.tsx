"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function DoctorProfilePage() {
  const router = useRouter();
  
  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          My Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your account details and password.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8 mb-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserIcon />
          </div>
          <div className="text-center sm:text-left pt-2">
            <h2 className="text-2xl font-bold text-slate-900">Dr. Ahmed Hassan</h2>
            <p className="text-slate-500 font-medium mt-1">Cardiology</p>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 mt-3">
              Active
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Email</span>
            <span className="text-sm font-medium text-slate-900">ahmed@hakeem.test</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">License Number</span>
            <span className="text-sm font-medium text-slate-900">EG-12345</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Specialty</span>
            <span className="text-sm font-medium text-slate-900">Cardiology</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <span className="text-sm font-medium text-emerald-500">Active</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between py-2">
            <span className="text-sm font-medium text-slate-500">Member Since</span>
            <span className="text-sm font-medium text-slate-900">10 Aug 2026</span>
          </div>
        </div>

        <div className="mt-10">
          <Button 
            className="w-full sm:w-auto px-8"
            onClick={() => router.push('/doctor/profile/change-password')}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
