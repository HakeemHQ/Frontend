"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Search01Icon as SearchIcon,
  FilterIcon,
  DocumentValidationIcon,
  CheckmarkCircle02Icon,
  Time02Icon,
  FileAddIcon,
  MoreVerticalIcon
} from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";
import { getPatientMedicalCvs } from "@/lib/api/medical-cvs";
import { PatientMedicalCv } from "@/types/medical-cv";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export default function MedicalCvListPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const { code } = use(params);

  const [cvs, setCvs] = useState<PatientMedicalCv[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [verificationFilter, setVerificationFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCvs = async () => {
      try {
        setIsLoading(true);
        const dataStr = sessionStorage.getItem(`access_${code}`);
        let patientId = "";
        if (dataStr) {
          try {
            const accessData = JSON.parse(dataStr);
            patientId = accessData?.patientId || accessData?.patient?.patientId;
          } catch (e) {}
        }
        
        if (!patientId) {
          throw new Error("Patient ID not found in session.");
        }

        const res = await getPatientMedicalCvs(patientId);
        
        let items: any[] = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res && typeof res === 'object') {
          const resObj = res as any;
          if (Array.isArray(resObj.data)) {
            items = resObj.data;
          } else if (Array.isArray(resObj.items)) {
            items = resObj.items;
          } else if (resObj.data && Array.isArray(resObj.data.items)) {
            items = resObj.data.items;
          } else if (resObj.items && Array.isArray(resObj.items.items)) {
            items = resObj.items.items;
          }
        }
        
        if (isMounted) {
          setCvs(Array.isArray(items) ? items : []);
        }
      } catch (err: any) {
        if (isMounted) {
          setToastMessage({
            message: err.response?.data?.message || t('doctor.medicalCvs.fetchError'),
            type: "error"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCvs();

    return () => {
      isMounted = false;
    };
  }, [code, t]);

  const filteredCVs = cvs.filter((cv) => {
    const titleMatch = (cv.title || "Untitled CV").toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = (cv.createdByRole || "").toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = verificationFilter === "All" || (cv.verificationStatus || "").toLowerCase() === verificationFilter.toLowerCase();
    return (titleMatch || roleMatch) && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    // Attempt to get translated status, fallback to original status text
    let translatedStatus = t(`doctor.medicalCvs.${normalizedStatus}`);
    if (!translatedStatus || translatedStatus.includes('doctor.medicalCvs.')) {
      translatedStatus = status;
    }

    switch (normalizedStatus) {
      case 'ready':
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wide border border-emerald-200">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3" />
            {translatedStatus}
          </span>
        );
      case 'draft':
      case 'queued':
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-bold uppercase tracking-wide border border-amber-200">
            <HugeiconsIcon icon={Time02Icon} className="w-3 h-3" />
            {translatedStatus}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wide border border-slate-200">
            {translatedStatus}
          </span>
        );
    }
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-full animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
            <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
            <div className="w-14 h-4 bg-slate-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        {/* Back Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Link 
            href={`/doctor/patients/workspace/${code}`}
            className="inline-flex items-center text-xs font-semibold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg backdrop-blur-md self-start"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {t('doctor.workspace.breadcrumbPatients')}
          </Link>
          <Link 
            href={`/doctor/patients/workspace/${code}/medical-cv/new`}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-white transition bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-sm hover:shadow gap-1.5 self-start sm:self-auto"
          >
            <HugeiconsIcon icon={FileAddIcon} className="w-4 h-4" />
            {t('doctor.medicalCvs.generateNew')}
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            {t('doctor.medicalCvs.title')}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-white/80 font-medium max-w-xl">
            {t('doctor.medicalCvs.description')}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <Input 
            placeholder={t('doctor.medicalCvs.searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<HugeiconsIcon icon={SearchIcon} className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {t('doctor.medicalCvs.statusLabel')}:
          </span>
          <div className="w-40">
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

      {/* CV Cards Grid */}
      {isLoading ? (
        renderSkeletons()
      ) : filteredCVs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCVs.map((cv, idx) => {
              const status = cv.verificationStatus || 'Unknown';
              const versionNumber = cv.latestVersionNumber || 1;

              return (
                <motion.div
                  key={`${cv.medicalCvId || 'cv'}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={`/doctor/patients/workspace/${code}/medical-cv/${cv.medicalCvId}`}
                    className="block h-full group"
                  >
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                          <HugeiconsIcon icon={DocumentValidationIcon} className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-base mb-1.5 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {cv.title || "Untitled CV"}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mb-3">
                          {cv.createdByRole || "Doctor"} • v{versionNumber}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
            <HugeiconsIcon icon={SearchIcon} className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-1 font-heading">
            {t('doctor.medicalCvs.noResults')}
          </h2>
          <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
            {t('doctor.medicalCvs.noResultsDesc')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={() => { setSearchQuery(""); setVerificationFilter("All"); }} variant="outline" className="text-xs px-3.5 py-1.5">
              {t('doctor.medicalCvs.clearFilters')}
            </Button>
            <Link href={`/doctor/patients/workspace/${code}/medical-cv/new`}>
              <Button className="text-xs px-4 py-1.5">
                {t('doctor.medicalCvs.generateNew')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
