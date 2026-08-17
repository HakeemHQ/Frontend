"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function DoctorsListPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { doctors, isDoctorsLoading, doctorsError, fetchDoctors } = useAdminStore();

  const specialtyOptions = [
    { value: "", label: t('admin.doctors.all') },
    { value: "Cardiology", label: t('admin.doctors.cardiology') },
    { value: "Neurology", label: t('admin.doctors.neurology') },
    { value: "Pediatrics", label: t('admin.doctors.pediatrics') },
    { value: "Orthopedics", label: t('admin.doctors.orthopedics') },
  ];

  const statusOptions = [
    { value: "", label: t('admin.doctors.all') },
    { value: "Active", label: t('admin.doctors.active') },
    { value: "Suspended", label: t('admin.doctors.suspended') },
  ];
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSpecialtyChange = (val: string) => {
    setSpecialtyFilter(val);
  };
  const handleStatusChangeFilter = (val: string) => {
    setStatusFilter(val);
  };

  // Fetch Data
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const doctorList = Array.isArray(doctors) 
    ? doctors 
    : (doctors && Array.isArray((doctors as any).items) ? (doctors as any).items : []);

  const filteredDoctors = doctorList.filter(doctor => {
    if (!doctor) return false;
    const searchLower = debouncedSearch.trim().toLowerCase();
    const docName = (doctor.name || `${(doctor as any).firstName || ""} ${(doctor as any).lastName || ""}`.trim() || "").toLowerCase();
    const docEmail = (doctor.email || "").toLowerCase();
    const docLicense = (doctor.licenseNumber || "").toLowerCase();
    const docSpecialty = (doctor.specialty || "").toLowerCase();
    const docStatus = (doctor.status || "").toLowerCase();
    
    const matchesSearch = searchLower === "" || 
      docName.includes(searchLower) || 
      docEmail.includes(searchLower) || 
      docLicense.includes(searchLower);
      
    const matchesSpecialty = specialtyFilter === "" || docSpecialty === specialtyFilter.toLowerCase();
    const matchesStatus = statusFilter === "" || docStatus === statusFilter.toLowerCase();
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[350px] flex flex-col justify-center">
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 font-heading">
                {t('admin.doctors.title')}
              </h1>
              <p className="text-xl text-white/80 font-medium">{t('admin.doctors.subtitle')}</p>
            </div>
            <Link 
              href="/admin/doctors/add"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/20 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl shrink-0"
            >
              <PlusIcon className="h-5 w-5 font-black" />
              {t('admin.doctors.addDoctor')}
            </Link>
          </div>
          
          {/* Filters inside Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl w-full max-w-5xl">
            <div className="w-full sm:flex-1">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('nav.search')}</span>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/50" />
                <input
                  placeholder={t('admin.doctors.searchPlaceholder')}
                  className="w-full bg-white/20 border-none text-white rounded-[20px] pl-12 pr-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-64">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.doctors.specialty')}</span>
              <select 
                className="w-full bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none appearance-none"
                value={specialtyFilter}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
              >
                {specialtyOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.doctors.status')}</span>
              <select 
                className="w-full bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none appearance-none"
                value={statusFilter}
                onChange={(e) => handleStatusChangeFilter(e.target.value)}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-16 relative z-20 px-4 md:px-8">
        <div className="overflow-hidden rounded-[40px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        {isDoctorsLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : doctorsError ? (
          <div className="flex flex-col justify-center items-center h-48 text-red-500">
            <p>{doctorsError}</p>
            <Button variant="outline" className="mt-4" onClick={() => fetchDoctors()}>
              {t('admin.doctors.retry')}
            </Button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex justify-center items-center h-48 text-slate-500">
            <p>{t('admin.doctors.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">{t('admin.doctors.doctor')}</th>
                  <th className="px-6 py-4">{t('admin.doctors.specialty')}</th>
                  <th className="px-6 py-4">{t('admin.doctors.licenseNumber')}</th>
                  <th className="px-6 py-4">{t('admin.doctors.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => (
                  <tr 
                    key={doctor.id} 
                    onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
                    className="transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      <div>
                        <div>{doctor.name}</div>
                        <div className="text-xs font-normal text-slate-500">{doctor.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{doctor.specialty}</td>
                    <td className="whitespace-nowrap px-6 py-4">{doctor.licenseNumber}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                          doctor.status.toLowerCase() === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {doctor.status.toLowerCase() === 'active' ? t('admin.doctors.active') : t('admin.doctors.suspended')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
