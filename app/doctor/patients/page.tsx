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

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const STATUS_FILTERS = ["Active", "Expired", "Revoked"];

export default function PatientsPage() {
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
      setError(err.response?.data?.message || "Failed to fetch patients");
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
        setError("You cannot access files for an expired patient. Please request access again.");
        window.history.replaceState({}, '', '/doctor/patients');
      }
    }
  }, [setError]);

  const filteredPatients = (patients || []).filter(
    (p) => 
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.patientCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12 max-w-5xl mx-auto relative">
      <AnimatePresence>
        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Patients
          </h1>
          <p className="text-slate-500 text-base">
            Manage your patients and access permissions beautifully.
          </p>
        </div>
        <Link href="/doctor/patients/verify-identity">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap rounded-xl shadow-md hover:shadow-lg transition-all h-12 px-6 font-medium">
            Verify New Patient
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="w-full md:flex-1">
          <Input
            placeholder="Search by patient name or code..."
            iconLeft={<SearchIcon className="h-5 w-5 text-slate-400" />}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
        {/* Status Filter Pills */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto shrink-0 px-2 pb-2 md:pb-0 scrollbar-hide">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-300 ${
                statusFilter === status 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 flex flex-col gap-4 min-h-[300px]">
        {isLoading ? (
          // Skeleton Loader
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-100 rounded-md w-40"></div>
                    <div className="h-4 bg-slate-50 rounded-md w-28"></div>
                  </div>
                </div>
                <div className="space-y-3 text-right flex flex-col items-end">
                  <div className="h-5 bg-slate-100 rounded-md w-20"></div>
                  <div className="h-4 bg-slate-50 rounded-md w-32"></div>
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
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-3xl"
                  >
                    <div 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-slate-100/80 bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 gap-4 sm:gap-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                          <UserIcon />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">{patient.fullName}</h3>
                          <p className="text-sm font-medium text-slate-500 mt-0.5">Code: {patient.patientCode}</p>
                        </div>
                      </div>
                      <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        {itemStatus === "Active" ? (
                          <>
                            <span className="inline-block px-3 py-1.5 text-xs font-bold tracking-wide rounded-lg bg-emerald-50 text-emerald-600 mb-1 sm:mb-2">
                              ACTIVE
                            </span>
                            {timeStr && (
                              <p className="text-sm font-medium text-slate-400">
                                Until {timeStr}
                              </p>
                            )}
                          </>
                        ) : itemStatus === "Revoked" ? (
                           <span className="inline-block px-3 py-1.5 text-xs font-bold tracking-wide rounded-lg bg-rose-50 text-rose-600 mb-1 sm:mb-2">
                             REVOKED
                           </span>
                        ) : (
                           <span className="inline-block px-3 py-1.5 text-xs font-bold tracking-wide rounded-lg bg-slate-100 text-slate-600 mb-1 sm:mb-2">
                             EXPIRED
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
            className="flex flex-col items-center justify-center h-64 text-slate-500 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200"
          >
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-xl text-slate-900 mb-1">No patients found</p>
            <p className="text-base text-slate-500 max-w-md">
              {statusFilter === "All" 
                ? "You haven't requested access to any patients yet. Start by verifying a new patient."
                : `You don't have any patients with status: ${statusFilter}`}
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Premium Pagination Controls */}
      {!isLoading && filteredPatients.length > 0 && (
        <div className="flex justify-between items-center pt-8 border-t border-slate-100/80">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500 font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            Page {page}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(page + 1)}
            disabled={patients.length < 10}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
