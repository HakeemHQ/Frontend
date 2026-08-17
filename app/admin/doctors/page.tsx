"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  UserAdd01Icon, 
  Cancel01Icon, 
  ArrowRight02Icon, 
  UserGroupIcon 
} from "@hugeicons/core-free-icons";

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
    }, 350);
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
                {t('admin.doctors.title')}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-white/80 font-medium">
                {t('admin.doctors.subtitle') || "Manage and oversee all registered doctors"}
              </p>
            </div>
            <Link 
              href="/admin/doctors/add"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow shrink-0"
            >
              <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
              <span>{t('admin.doctors.addDoctor')}</span>
            </Link>
          </div>
          
          {/* Filters inside Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-md border border-white/20">
            <div className="sm:col-span-6">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">{t('nav.search')}</span>
              <div className="relative">
                <HugeiconsIcon icon={Search01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  placeholder={t('admin.doctors.searchPlaceholder')}
                  className="w-full bg-white/20 border border-white/10 text-white rounded-lg pl-10 pr-8 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white outline-none placeholder-white/50 transition-all"
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button 
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <Select
                variant="hero"
                label={t('admin.doctors.specialty')}
                options={specialtyOptions}
                value={specialtyFilter}
                onChange={handleSpecialtyChange}
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                variant="hero"
                label={t('admin.doctors.status')}
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusChangeFilter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isDoctorsLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : doctorsError ? (
          <div className="flex flex-col justify-center items-center py-12 text-red-500 gap-3">
            <p className="text-sm font-semibold">{doctorsError}</p>
            <Button variant="outline" className="text-xs px-4 py-2" onClick={() => fetchDoctors()}>
              {t('admin.doctors.retry')}
            </Button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
              <HugeiconsIcon icon={UserGroupIcon} className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-800 mb-1">{t('admin.doctors.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">{t('admin.doctors.doctor')}</th>
                  <th className="px-5 py-3.5">{t('admin.doctors.specialty')}</th>
                  <th className="px-5 py-3.5">{t('admin.doctors.licenseNumber')}</th>
                  <th className="px-5 py-3.5">{t('admin.doctors.status')}</th>
                  <th className="px-5 py-3.5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => {
                  const isActive = doctor.status.toLowerCase() === "active";
                  return (
                    <tr 
                      key={doctor.id} 
                      onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
                      className="transition-colors hover:bg-slate-50 cursor-pointer group"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {doctor.name ? doctor.name[0].toUpperCase() : "D"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{doctor.name}</div>
                            <div className="text-xs font-normal text-slate-400">{doctor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-slate-600">{doctor.specialty}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-slate-500">{doctor.licenseNumber}</td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isActive ? t('admin.doctors.active') : t('admin.doctors.suspended')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-slate-400">
                        <HugeiconsIcon icon={ArrowRight02Icon} className="w-4 h-4 ml-auto inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
