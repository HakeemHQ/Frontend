"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  FileAddIcon,
  DocumentValidationIcon,
  MoreVerticalIcon,
  CheckmarkCircle02Icon,
  Time02Icon,
  SearchIcon,
  FilterIcon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientMedicalCvsStore } from "@/store/usePatientMedicalCvsStore";
import { Toast } from "@/components/ui/Toast";

export default function MedicalCVsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { cvs, isLoading, error, fetchCvs } = usePatientMedicalCvsStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const dataStr = sessionStorage.getItem(`access_${code}`);
    if (dataStr) {
      try {
        const accessData = JSON.parse(dataStr);
        const patientId = accessData?.patientId || accessData?.patient?.patientId;
        if (patientId) {
          fetchCvs(patientId);
        } else {
          setToastMessage({ message: "Could not find Patient ID for this workspace.", type: "error" });
        }
      } catch (e) {
        console.error("Failed to parse access data");
      }
    }
  }, [code, fetchCvs]);

  useEffect(() => {
    if (error) {
      setToastMessage({ message: error, type: 'error' });
    }
  }, [error]);

  const filteredCVs = cvs.filter(cv => {
    const matchesSearch = cv.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status mapping for filter: we map based on the backend's status
    const status = cv.verificationStatus || "unknown";
    let matchesVerification = true;
    if (verificationFilter === "Draft" && status.toLowerCase() !== "draft") matchesVerification = false;
    if (verificationFilter === "Ready" && status.toLowerCase() !== "ready" && status.toLowerCase() !== "approved") matchesVerification = false;
    
    return matchesSearch && matchesVerification;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
            Ready
          </span>
        );
      case 'draft':
      case 'queued':
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
            <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const renderSkeletons = () => (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
            <div className="w-5 h-5 bg-slate-100 rounded-full"></div>
          </div>
          <div className="flex-1 space-y-2 mb-4">
            <div className="h-5 bg-slate-100 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="w-16 h-5 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 animate-in fade-in duration-300 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Back Navigation */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href={`/doctor/patients/workspace/${code}`}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1.5" />
          Back to Workspace
        </Link>
        <Link href={`/doctor/patients/workspace/${code}/medical-cv/new`}>
          <Button className="flex items-center gap-2 rounded-xl">
            <HugeiconsIcon icon={FileAddIcon} className="w-4 h-4" />
            New Medical CV
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">Medical CVs</h1>
        <p className="text-slate-500">
          View and manage the structured summaries of the patient&apos;s medical history.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input 
            placeholder="Search by title..." 
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
                { value: "Draft", label: "Draft" },
                { value: "Ready", label: "Ready" }
              ]}
              value={verificationFilter}
              onChange={setVerificationFilter}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        renderSkeletons()
      ) : filteredCVs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredCVs.map((cv, idx) => {
              const status = cv.verificationStatus || 'Unknown';
              const versionNumber = cv.latestVersionNumber || 1;

              return (
                <motion.div
                  key={`${cv.medicalCvId || 'cv'}-${idx}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={`/doctor/patients/workspace/${code}/medical-cv/${cv.medicalCvId}`}
                    className="block h-full"
                  >
                    <div 
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                          <HugeiconsIcon icon={DocumentValidationIcon} className="w-6 h-6" />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <HugeiconsIcon icon={MoreVerticalIcon} className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {cv.title || "Untitled CV"}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mb-1 capitalize">
                          Medical CV <span className="font-medium">({cv.createdByRole || "Doctor"})</span>
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mb-4 bg-slate-50 inline-block px-2 py-0.5 rounded">
                          Version {versionNumber}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm"
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <HugeiconsIcon icon={SearchIcon} className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">No CVs Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            We couldn&apos;t find any Medical CVs matching your current filters.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => { setSearchQuery(""); setVerificationFilter("All"); }} variant="outline" className="rounded-xl">
              Clear Filters
            </Button>
            <Link href={`/doctor/patients/workspace/${code}/medical-cv/new`}>
              <Button className="rounded-xl">Generate Medical CV</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
