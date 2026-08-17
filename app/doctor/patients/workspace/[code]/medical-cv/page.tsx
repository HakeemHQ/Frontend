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

import { useLanguage } from "@/localization/LanguageContext";

export default function MedicalCVsPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
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
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-wide border border-emerald-100 shadow-sm">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
            {t('doctor.medicalCvs.ready')}
          </span>
        );
      case 'draft':
      case 'queued':
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold uppercase tracking-wide border border-amber-100 shadow-sm">
            <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-wide border border-slate-200 shadow-sm">
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
      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12">
          <HugeiconsIcon icon={FileAddIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation & Actions */}
        <div className="absolute top-10 left-10 right-10 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link 
            href={`/doctor/patients/workspace/${code}`}
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.workspace.breadcrumbPatients')}
          </Link>
          <Link 
            href={`/doctor/patients/workspace/${code}/medical-cv/new`}
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={FileAddIcon} className="w-5 h-5" />
            {t('doctor.medicalCvs.generateNew')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.medicalCvs.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl">
            {t('doctor.medicalCvs.description')}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-8 rounded-[40px] border-0 shadow-2xl shadow-slate-200/50 mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between relative z-30 -mt-20 mx-4 md:mx-8">
        <div className="w-full md:w-96">
          <Input 
            placeholder={t('doctor.medicalCvs.searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<HugeiconsIcon icon={SearchIcon} className="w-5 h-5" />}
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <HugeiconsIcon icon={FilterIcon} className="w-5 h-5" />
            {t('doctor.medicalCvs.statusLabel')}:
          </div>
          <div className="w-48">
            <Select 
              options={[
                { value: "All", label: t('doctor.medicalCvs.allStatuses') },
                { value: "Draft", label: t('doctor.medicalCvs.unreviewed') },
                { value: "Ready", label: t('doctor.medicalCvs.ready') }
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
                      className="bg-white border-0 rounded-[40px] p-8 lg:p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer group flex flex-col h-full relative overflow-hidden"
                    >
                      {/* Decorative Background Icon */}
                      <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-50 group-hover:text-primary/5 group-hover:scale-110 transition-all duration-500 transform rotate-12 pointer-events-none">
                         <HugeiconsIcon icon={DocumentValidationIcon} className="w-48 h-48" />
                      </div>

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg shadow-primary/10">
                          <HugeiconsIcon icon={DocumentValidationIcon} className="w-8 h-8" />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <HugeiconsIcon icon={MoreVerticalIcon} className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 relative z-10">
                        <h3 className="font-black text-slate-900 text-2xl font-heading mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                          {cv.title || "Untitled CV"}
                        </h3>
                        <p className="text-base font-bold text-slate-500 mb-3 capitalize">
                          {t('doctor.medicalCvs.title')} <span className="font-medium text-slate-400">({cv.createdByRole || "Doctor"})</span>
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mb-4 bg-slate-50 inline-block px-2 py-0.5 rounded">
                          {t('doctor.medicalCvs.version')} {versionNumber}
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
            {t('doctor.medicalCvs.noResults')}
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {t('doctor.medicalCvs.noResultsDesc')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => { setSearchQuery(""); setVerificationFilter("All"); }} variant="outline">
              {t('doctor.medicalCvs.clearFilters')}
            </Button>
            <Link href={`/doctor/patients/workspace/${code}/medical-cv/new`}>
              <Button>
                {t('doctor.medicalCvs.generateNew')}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
