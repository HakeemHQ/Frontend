"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  DocumentValidationIcon,
  UserIcon,
  PillsTabletIcon,
  FirstAidKitIcon,
  Note01Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/Button";

// Mock data for the CV detail
const mockCVDetails = {
  "cv-123": {
    title: "Cardiology Medical CV",
    status: "DoctorVerified",
    patientName: "Mazen Mohamed",
    version: 2,
    date: "2023-10-15",
    content: {
      conditions: ["Hypertension (Diagnosed 2020)", "Type 2 Diabetes Mellitus (Diagnosed 2018)"],
      medications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
      allergies: ["Penicillin (Rash)"],
      recentNotes: "Patient reports stable blood pressure. Adhering to medication regimen."
    }
  },
  "cv-124": {
    title: "My Diabetes CV",
    status: "Unreviewed",
    patientName: "Mazen Mohamed",
    version: 1,
    date: "2023-11-02",
    content: {
      conditions: ["Type 2 Diabetes Mellitus (Diagnosed 2018)"],
      medications: ["Metformin 500mg twice daily", "Glipizide 5mg daily"],
      allergies: ["None known"],
      recentNotes: "HbA1c levels slightly elevated at last check. Discussing diet adjustments."
    }
  },
  // Default fallback for any other ID
  "default": {
    title: "General Medical CV",
    status: "Unreviewed",
    patientName: "Patient Name",
    version: 1,
    date: "2023-12-01",
    content: {
      conditions: ["Asthma"],
      medications: ["Albuterol inhaler as needed"],
      allergies: ["Pollen"],
      recentNotes: "General checkup completed. No immediate concerns."
    }
  }
};

export default function CVReviewPage({ params }: { params: Promise<{ code: string, cvId: string }> }) {
  const router = useRouter();
  const { code, cvId } = use(params);
  
  // Use specific mock data if available, else default
  const cvData = mockCVDetails[cvId as keyof typeof mockCVDetails] || mockCVDetails["default"];
  const [status, setStatus] = useState(cvData.status);

  const handleApprove = () => {
    // In a real app, this would call the API to update the status
    setStatus("DoctorVerified");
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-24 animate-in fade-in duration-300">
      {/* Back Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1.5" />
          Back to CVs
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
            <HugeiconsIcon icon={DocumentValidationIcon} className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading tracking-tight mb-1">
              {cvData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{cvData.patientName}</span>
              <span>•</span>
              <span>Version {cvData.version}</span>
              <span>•</span>
              <span>{cvData.date}</span>
            </div>
          </div>
        </div>

        <div>
          {status === "DoctorVerified" ? (
             <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-emerald-100">
             <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4" />
             Verified
           </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold uppercase tracking-wide border border-amber-100">
             <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
             Needs Review
           </span>
          )}
        </div>
      </div>

      {/* CV Content Sections */}
      <div className="space-y-6">
        
        {/* Conditions */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <HugeiconsIcon icon={FirstAidKitIcon} className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Conditions & Diagnoses</h2>
          </div>
          <ul className="space-y-3">
            {cvData.content.conditions.map((condition, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                {condition}
              </li>
            ))}
          </ul>
        </section>

        {/* Medications */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <HugeiconsIcon icon={PillsTabletIcon} className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Current Medications</h2>
          </div>
          <ul className="space-y-3">
            {cvData.content.medications.map((med, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                {med}
              </li>
            ))}
          </ul>
        </section>

        {/* Allergies & Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Allergies</h2>
            </div>
            <ul className="space-y-3">
              {cvData.content.allergies.map((allergy, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  {allergy}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                <HugeiconsIcon icon={Note01Icon} className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Clinical Notes</h2>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              {cvData.content.recentNotes}
            </p>
          </section>
        </div>
      </div>

      {/* Bottom Action Bar for Reviewing */}
      {status === "Unreviewed" && (
        <div className="fixed bottom-0 left-0 right-0 md:left-[260px] bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Review Required</h3>
              <p className="text-sm text-slate-500">Please review this generated CV for clinical accuracy.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100">
                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                Reject
              </Button>
              <Button onClick={handleApprove} className="flex-1 sm:flex-none flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 shadow-sm shadow-emerald-200 text-white">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} fontVariant="solid" className="w-4 h-4" />
                Approve & Verify
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
