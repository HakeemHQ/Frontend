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
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="max-w-7xl mx-auto pt-4 pb-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">All Patient CVs</h1>
        <p className="text-slate-500 text-base">
          View and review Medical CVs across all your active patients seamlessly.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2">
          <Input 
            placeholder="Search by title, patient name or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<HugeiconsIcon icon={SearchIcon} className="w-5 h-5 text-slate-400" />}
            className="border-none bg-slate-50/50 shadow-inner focus-visible:bg-white focus-visible:ring-emerald-500/20 rounded-2xl h-14"
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 pl-2">
            <HugeiconsIcon icon={FilterIcon} className="w-5 h-5" />
            Status
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
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          <AnimatePresence>
            {filteredCVs.map((cv) => (
              <motion.div
                key={cv.medicalCvId}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  href={`/doctor/patients/workspace/${cv.patientCode}/medical-cv/${cv.medicalCvId}`} 
                  className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-3xl"
                >
                  <div 
                    className="bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                        <HugeiconsIcon icon={DocumentValidationIcon} className="w-7 h-7" />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
                        <HugeiconsIcon icon={MoreVerticalIcon} className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-xl mb-1.5 leading-tight group-hover:text-emerald-700 transition-colors">
                        {cv.title}
                      </h3>
                      <div className="text-sm font-semibold text-slate-600 mb-1.5">
                        {cv.patientName} <span className="text-slate-400 font-medium">({cv.patientCode})</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 mb-5 bg-slate-50 inline-block px-2.5 py-1 rounded-md">
                        Version {cv.latestVersionNumber} • {cv.date}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-slate-100/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(cv.generationStatus, 'generation')}
                        {getStatusBadge(cv.verificationStatus, 'verification')}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/50 backdrop-blur-xl border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm"
        >
          <div className="w-20 h-20 bg-white shadow-sm text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <HugeiconsIcon icon={SearchIcon} className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">No CVs Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-base">
            We couldn&apos;t find any Medical CVs matching your current filters. Try adjusting your search or status filter.
          </p>
          <Button 
            onClick={() => { setSearchQuery(""); setVerificationFilter("All"); }}
            className="rounded-xl h-12 px-6 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
