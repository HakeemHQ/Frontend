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
import { 
  UserGroupIcon, 
  UserAdd01Icon, 
  Search01Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  UserIcon,
  ArrowRight02Icon 
} from "@hugeicons/core-free-icons";
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
    setStatusFilter,
    hasNextPage,
    setHasNextPage,
    setTotalCount
  } = usePatientsStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async (pageNum: number, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPatients(pageNum, 11, status);
      const actualData = (response as any).data || response;
      let rawItems: any[] = [];
      if (actualData && actualData.items) {
        rawItems = actualData.items;
      } else if (Array.isArray(actualData)) {
        rawItems = actualData;
      }

      if (actualData && typeof actualData.hasNextPage === 'boolean') {
        setHasNextPage(actualData.hasNextPage);
        setPatients(rawItems.slice(0, 10));
      } else if (actualData && (actualData.totalCount !== undefined || actualData.total !== undefined)) {
        const total = actualData.totalCount ?? actualData.total;
        setTotalCount(total);
        setHasNextPage(pageNum * 10 < total);
        setPatients(rawItems.slice(0, 10));
      } else {
        const hasMore = rawItems.length > 10;
        setHasNextPage(hasMore);
        setPatients(rawItems.slice(0, 10));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('ui.somethingWentWrong'));
      setPatients([]);
      setHasNextPage(false);
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
      } else if (urlParams.get("access_denied") === "true") {
        setError(t('doctor.patients.sessionClosedOrExpired'));
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
    <div className="pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      <AnimatePresence>
        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              {t('doctor.patients.title')}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 font-medium max-w-xl">
              {t('doctor.patients.description')}
            </p>
          </div>

          <Link 
            href="/doctor/verify-identity"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow shrink-0"
          >
            <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4" />
            <span>{t('doctor.patients.verifyNewPatient')}</span>
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100 mb-6">
          <div className="w-full md:flex-1 relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder={t('doctor.patients.searchPlaceholder')}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          
          {/* Status Filter Pills */}
          <div className="flex gap-1.5 w-full md:w-auto shrink-0 overflow-x-auto">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  statusFilter === status 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-3 min-h-[260px]">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-36"></div>
                      <div className="h-3 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded-full w-20"></div>
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
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
                      className="block outline-none rounded-xl group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-primary/40 hover:shadow-sm transition-all duration-200 gap-3 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                            <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                              {patient.fullName}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              {t('doctor.patients.code')}: <span className="font-mono text-slate-600">{patient.patientCode}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="sm:text-right">
                            {itemStatus === "Active" ? (
                              <>
                                <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {t('doctor.patients.statusActive')}
                                </span>
                                {timeStr && (
                                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                    {t('doctor.patients.until')} {timeStr}
                                  </p>
                                )}
                              </>
                            ) : itemStatus === "Revoked" ? (
                              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                {t('doctor.patients.statusRevoked')}
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                {t('doctor.patients.statusExpired')}
                              </span>
                            )}
                          </div>
                          <HugeiconsIcon icon={ArrowRight02Icon} className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
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
              className="flex flex-col items-center justify-center py-12 text-slate-500 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200"
            >
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-300">
                <HugeiconsIcon icon={UserIcon} className="w-6 h-6" />
              </div>
              <p className="font-bold text-base text-slate-800 mb-1">{t('doctor.patients.noResults')}</p>
              <p className="text-xs text-slate-500 max-w-xs">
                {statusFilter === "All" 
                  ? t('doctor.patients.noResultsDescription')
                  : t('doctor.patients.noResultsWithStatus').replace('{status}', getStatusLabel(statusFilter))}
              </p>
              {page > 1 && (
                <button
                  onClick={() => setPage(1)}
                  className="mt-4 rounded-lg border border-primary text-primary hover:bg-primary/5 font-semibold px-4 py-1.5 text-xs cursor-pointer"
                >
                  {t('doctor.patients.previous') ? `${t('doctor.patients.previous')} (Page 1)` : "Back to Page 1"}
                </button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && (filteredPatients.length > 0 || page > 1) && (
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{t('doctor.patients.previous')}</span>
            </button>
            <span className="text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 select-none">
              {t('doctor.patients.page')} {page}
            </span>
            <button 
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage || filteredPatients.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>{t('doctor.patients.next')}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
