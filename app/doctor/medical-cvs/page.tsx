"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DocumentValidationIcon,
  MoreVerticalIcon,
  CheckmarkCircle02Icon,
  Time02Icon,
  SearchIcon,
  FilterIcon
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Mock Data for Global CVs across patients
const mockAllCVs = [
  {
    medicalCvId: "cv-123",
    patientCode: "P-7829",
    patientName: "Mazen Mohamed",
    title: "Cardiology Medical CV",
    latestVersionNumber: 2,
    generationStatus: "Ready",
    verificationStatus: "DoctorVerified",
    date: "2023-10-15"
  },
  {
    medicalCvId: "cv-124",
    patientCode: "P-7829",
    patientName: "Mazen Mohamed",
    title: "My Diabetes CV",
    latestVersionNumber: 1,
    generationStatus: "Ready",
    verificationStatus: "Unreviewed",
    date: "2023-11-02"
  },
  {
    medicalCvId: "cv-128",
    patientCode: "P-4421",
    patientName: "Sarah Ahmed",
    title: "Neurology Summary",
    latestVersionNumber: 1,
    generationStatus: "Ready",
    verificationStatus: "Unreviewed",
    date: "2023-12-10"
  },
  {
    medicalCvId: "cv-129",
    patientCode: "P-1190",
    patientName: "Omar Tarek",
    title: "Post-Surgery Recovery",
    latestVersionNumber: 3,
    generationStatus: "Ready",
    verificationStatus: "DoctorVerified",
    date: "2023-12-15"
  }
];

export default function GlobalMedicalCVsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All");

  const filteredCVs = mockAllCVs.filter(cv => {
    const matchesSearch = cv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cv.patientCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVerification = verificationFilter === "All" || cv.verificationStatus === verificationFilter;

    return matchesSearch && matchesVerification;
  });

  const getStatusBadge = (status: string, type: 'generation' | 'verification') => {
    if (type === 'generation') {
      switch (status) {
        case 'Ready':
          return (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
              Ready
            </span>
          );
        case 'Queued':
          return (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
              <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
              Queued
            </span>
          );
        default:
          return (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-slate-200">
              {status}
            </span>
          );
      }
    } else {
      switch (status) {
        case 'DoctorVerified':
          return (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-blue-100">
              <HugeiconsIcon icon={DocumentValidationIcon} className="w-3.5 h-3.5" />
              Verified
            </span>
          );
        case 'Unreviewed':
          return (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-slate-200">
              Unreviewed
            </span>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-12 px-4 md:px-8 animate-in fade-in duration-300">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">All Patient CVs</h1>
        <p className="text-slate-500 text-lg">
          View and review Medical CVs across all your active patients.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input 
            placeholder="Search by title, patient name or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<HugeiconsIcon icon={SearchIcon} className="w-5 h-5" />}
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <HugeiconsIcon icon={FilterIcon} className="w-5 h-5" />
            Status:
          </div>
          <div className="w-48">
            <Select 
              options={[
                { value: "All", label: "All Statuses" },
                { value: "Unreviewed", label: "Unreviewed" },
                { value: "DoctorVerified", label: "Verified" }
              ]}
              value={verificationFilter}
              onChange={setVerificationFilter}
            />
          </div>
        </div>
      </div>

      {/* CVs Grid */}
      {filteredCVs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCVs.map((cv) => (
            <Link 
              href={`/doctor/patients/workspace/${cv.patientCode}/medical-cv/${cv.medicalCvId}`} 
              key={cv.medicalCvId}
              className="block"
            >
              <div 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={DocumentValidationIcon} className="w-6 h-6" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <HugeiconsIcon icon={MoreVerticalIcon} className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                    {cv.title}
                  </h3>
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    {cv.patientName} <span className="text-slate-400">({cv.patientCode})</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mb-4">
                    Version {cv.latestVersionNumber} • {cv.date}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(cv.generationStatus, 'generation')}
                    {getStatusBadge(cv.verificationStatus, 'verification')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <HugeiconsIcon icon={SearchIcon} className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">No CVs Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            We couldn&apos;t find any Medical CVs matching your current filters. Try adjusting your search or status filter.
          </p>
          <Button onClick={() => { setSearchQuery(""); setVerificationFilter("All"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
