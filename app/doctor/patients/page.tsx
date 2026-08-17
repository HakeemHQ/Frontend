"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePatientsStore } from "@/store/usePatientsStore";
import { getPatients } from "@/lib/api/patients";
import { Toast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, UserAdd01Icon, Search01Icon } from "@hugeicons/core-free-icons";

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

import { useLanguage } from "@/localization/LanguageContext";

const STATUS_FILTERS = ["Active", "Expired", "Revoked"];

export default function PatientsPage() {
  const { t } = useLanguage();
  const { 
    patients, 
    setPatients, 
    isLoading, 
    setIsLoading, 
    error, 
    setError, 
    page, 
    setPage,
    statusFilter,
    setStatusFilter
  } = usePatientsStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async (pageNum: number, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPatients(pageNum, 10, status);
      const actualData = (response as any).data || response;
      if (actualData && actualData.items) {
        setPatients(actualData.items);
      } else if (Array.isArray(actualData)) {
        setPatients(actualData);
      } else {
        setPatients([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('ui.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(page, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("expired") === "true") {
        setError(t('doctor.workspace.expiredMessage'));
        window.history.replaceState({}, '', '/doctor/patients');
      }
    }
  }, [setError, t]);

  const filteredPatients = (patients || []).filter(
    (p) => 
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.patientCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Active": return t('doctor.patients.active');
      case "Expired": return t('doctor.patients.expired');
      case "Revoked": return t('doctor.patients.revoked');
      default: return status;
    }
  };

  return (
    <div className="pb-12 max-w-6xl mx-auto relative px-4 sm:px-6 mt-4">
      <AnimatePresence>
        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={UserGroupIcon} className="w-[500px] h-[500px]" />
        </div>
        
        <div className="absolute top-10 right-10 z-20">
          <Link 
            href="/doctor/patients/verify-identity"
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={UserAdd01Icon} className="w-5 h-5" />
            {t('doctor.patients.verifyNewPatient')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.patients.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl">
            {t('doctor.patients.description')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-5xl border-0">

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-4 rounded-[32px] border border-slate-100 mb-10">
          <div className="w-full md:flex-1">
            <Input
              placeholder={t('doctor.patients.searchPlaceholder')}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="h-6 w-6 text-slate-400" />}
              className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg font-bold h-14"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-10 w-0.5 bg-slate-200 hidden md:block rounded-full"></div>
          {/* Status Filter Pills */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto shrink-0 p-2 scrollbar-hide">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-8 py-4 text-base font-black rounded-full whitespace-nowrap transition-all duration-300 shadow-sm ${
                  statusFilter === status 
                    ? "bg-primary text-white shadow-lg shadow-primary/30 -translate-y-1" 
                    : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

      <div className="space-y-6 flex flex-col gap-4 min-h-[300px]">
        {isLoading ? (
          // Skeleton Loader
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-8 rounded-[32px] border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-[24px] bg-slate-200"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-slate-200 rounded-lg w-48"></div>
                    <div className="h-5 bg-slate-200 rounded-lg w-32"></div>
                  </div>
                </div>
                <div className="space-y-4 text-right flex flex-col items-end">
                  <div className="h-6 bg-slate-200 rounded-lg w-24"></div>
                  <div className="h-5 bg-slate-200 rounded-lg w-36"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length > 0 ? (
          <AnimatePresence>
            {filteredPatients.map((patient, index) => {
              let timeStr = patient.expiresAt || "";
              let isExpired = false;
              
              try {
                if (patient.expiresAt) {
                  let expiryString = patient.expiresAt;
                  if (typeof expiryString === 'string' && !expiryString.endsWith('Z')) {
                    expiryString += 'Z';
                  }
                  const d = new Date(expiryString);
                  isExpired = d.getTime() < Date.now();
                  if (!isNaN(d.getTime())) {
                    timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " on " + d.toLocaleDateString();
                  }
                }
              } catch (e) {}

              let itemStatus = statusFilter !== "All" ? statusFilter : (isExpired ? "Expired" : "Active");

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={patient.accessId || patient.patientCode}
                >
                  <Link 
                    href={`/doctor/patients/workspace/${patient.patientCode}`}
                    onClick={(e) => {
                      if (itemStatus === "Expired" || itemStatus === "Revoked") {
                        e.preventDefault();
                        setError(`You cannot access files for a${itemStatus === "Expired" ? "n expired" : " revoked"} patient. Please request access again.`);
                        return;
                      }
                      
                      const sessionData = {
                        ...patient,
                        patient: {
                          patientCode: patient.patientCode,
                          fullName: patient.fullName
                        }
                      };
                      sessionStorage.setItem(`access_${patient.patientCode}`, JSON.stringify(sessionData));
                    }}
                    className="block outline-none focus-visible:ring-4 focus-visible:ring-primary/30 rounded-[32px]"
                  >
                    <div 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 rounded-[32px] border-2 border-slate-100 bg-white hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 gap-6 sm:gap-0 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                      
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                          <UserIcon className="w-10 h-10" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 font-heading tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight">{patient.fullName}</h3>
                          <p className="text-base font-bold text-slate-500 mt-1">{t('doctor.patients.code')}: {patient.patientCode}</p>
                        </div>
                      </div>
                      <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center relative z-10">
                        {itemStatus === "Active" ? (
                          <>
                            <span className="inline-block px-5 py-2.5 text-sm font-black tracking-widest uppercase rounded-full bg-emerald-100 text-emerald-700 mb-2 shadow-sm border border-emerald-200">
                              {t('doctor.patients.statusActive')}
                            </span>
                            {timeStr && (
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                                {t('doctor.patients.until')} {timeStr}
                              </p>
                            )}
                          </>
                        ) : itemStatus === "Revoked" ? (
                           <span className="inline-block px-5 py-2.5 text-sm font-black tracking-widest uppercase rounded-full bg-rose-100 text-rose-700 mb-2 shadow-sm border border-rose-200">
                             {t('doctor.patients.statusRevoked')}
                           </span>
                        ) : (
                           <span className="inline-block px-5 py-2.5 text-sm font-black tracking-widest uppercase rounded-full bg-slate-100 text-slate-600 mb-2 shadow-sm border border-slate-200">
                             {t('doctor.patients.statusExpired')}
                           </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-slate-500 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200"
          >
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <UserIcon className="w-12 h-12 text-slate-300" />
            </div>
            <p className="font-black text-2xl text-slate-900 mb-2 font-heading tracking-tight">{t('doctor.patients.noResults')}</p>
            <p className="text-lg font-medium text-slate-500 max-w-md">
              {statusFilter === "All" 
                ? t('doctor.patients.noResultsDescription')
                : t('doctor.patients.noResultsWithStatus').replace('{status}', getStatusLabel(statusFilter))}
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Premium Pagination Controls */}
      {!isLoading && filteredPatients.length > 0 && (
        <div className="flex justify-between items-center pt-10 mt-6 border-t border-slate-100">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            className="rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 font-bold px-8 py-5 h-auto text-lg transition-all"
          >
            {t('doctor.patients.previous')}
          </Button>
          <span className="text-lg text-slate-900 font-black bg-slate-50 px-6 py-3 rounded-full border-2 border-slate-100 shadow-sm">
            {t('doctor.patients.page')} {page}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(page + 1)}
            disabled={patients.length < 10}
            className="rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 font-bold px-8 py-5 h-auto text-lg transition-all"
          >
            {t('doctor.patients.next')}
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}
