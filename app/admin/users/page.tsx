"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  UserGroupIcon, 
  Search01Icon, 
  Cancel01Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  FilterIcon,
  UserCheck01Icon,
  ArrowRight02Icon
} from "@hugeicons/core-free-icons";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function UsersListPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { users, isUsersLoading, usersError, fetchUsers } = useAdminStore();
  const [, startTransition] = useTransition();

  const roleOptions = [
    { value: "", label: t('admin.users.all') },
    { value: "Patient", label: t('admin.users.patient') },
    { value: "Doctor", label: t('admin.users.doctor') },
    { value: "Admin", label: t('admin.users.admin') },
  ];

  const statusOptions = [
    { value: "", label: t('admin.users.all') },
    { value: "Active", label: t('admin.users.active') },
    { value: "Suspended", label: t('admin.users.suspended') },
  ];
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset to page 1 whenever filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleRoleChangeFilter = (val: string) => {
    setUserTypeFilter(val);
    setPage(1);
  };

  const handleStatusChangeFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handlePageSizeChange = (val: number) => {
    setPageSize(val);
    setPage(1);
  };

  // Fetch users when parameters change
  useEffect(() => {
    fetchUsers({
      search: debouncedSearch.trim() || undefined,
      userType: userTypeFilter || undefined,
      status: statusFilter || undefined,
      page,
      pageSize
    });
  }, [debouncedSearch, userTypeFilter, statusFilter, page, pageSize, fetchUsers]);

  const items = users?.items || [];
  const totalCount = users?.totalCount ?? users?.total ?? items.length;
  const totalPages = users?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Determine if next button should be enabled
  const canGoPrevious = page > 1;
  const canGoNext = items.length === pageSize ? page < totalPages || totalPages > page : page < totalPages;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-8 sm:p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[340px] flex flex-col justify-center">
        {/* Background Graphic */}
        <div className="absolute -top-20 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={UserGroupIcon} className="w-[450px] h-[450px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-4xl">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-3 font-heading">
              {t('admin.users.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-medium max-w-2xl">
              {t('admin.users.subtitle') || "Manage patient, doctor, and admin system accounts across the platform"}
            </p>
          </div>
          
          {/* Filters Bar inside Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white/10 p-4 sm:p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl">
            {/* Search Input */}
            <div className="sm:col-span-6">
              <span className="text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider pl-2 block">
                {t('nav.search')}
              </span>
              <div className="relative">
                <HugeiconsIcon icon={Search01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder={t('admin.users.searchPlaceholder')}
                  className="w-full bg-white/20 border border-white/10 text-white rounded-[20px] pl-12 pr-10 py-3.5 text-base font-bold focus:ring-2 focus:ring-white outline-none placeholder-white/50 transition-all"
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer p-1 transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Role / UserType Filter */}
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider pl-2 block">
                {t('admin.users.role')}
              </span>
              <select 
                className="w-full bg-white/20 border border-white/10 text-white rounded-[20px] px-4 py-3.5 text-base font-bold focus:ring-2 focus:ring-white outline-none cursor-pointer appearance-none transition-all"
                value={userTypeFilter}
                onChange={(e) => handleRoleChangeFilter(e.target.value)}
              >
                {roleOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider pl-2 block">
                {t('admin.users.status')}
              </span>
              <select 
                className="w-full bg-white/20 border border-white/10 text-white rounded-[20px] px-4 py-3.5 text-base font-bold focus:ring-2 focus:ring-white outline-none cursor-pointer appearance-none transition-all"
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

      {/* Main Content Area */}
      <div className="-mt-14 relative z-20 px-2 sm:px-4 md:px-6">
        <div className="overflow-hidden rounded-[36px] sm:rounded-[40px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
          {/* Header Info Bar */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm sm:text-base font-bold text-slate-700">
                {isUsersLoading ? (
                  t('common.loading')
                ) : items.length > 0 ? (
                  <>
                    {t('doctor.patients.title') || "Showing"}: <span className="text-slate-900 font-black">{items.length}</span> {t('admin.users.title')?.toLowerCase() || "users"} (Page {page} of {totalPages})
                  </>
                ) : (
                  t('admin.users.noResults')
                )}
              </span>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('ui.pageSize') || "Per page"}:
              </span>
              <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200/60 shadow-inner">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`px-3.5 py-1.5 text-xs font-black rounded-full transition-all duration-200 cursor-pointer ${
                      pageSize === size
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table / Skeleton / Empty State */}
          {isUsersLoading ? (
            <div className="p-8 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-2xl w-full flex items-center justify-between px-6">
                  <div className="h-5 bg-slate-200 rounded-lg w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                  <div className="h-5 bg-slate-200 rounded-lg w-24"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                </div>
              ))}
            </div>
          ) : usersError ? (
            <div className="flex flex-col justify-center items-center py-20 text-rose-500 gap-3">
              <p className="font-bold text-lg">{usersError}</p>
              <button 
                onClick={() => fetchUsers({ search: debouncedSearch.trim() || undefined, userType: userTypeFilter || undefined, status: statusFilter || undefined, page, pageSize })}
                className="px-6 py-2.5 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200 hover:bg-rose-100 transition cursor-pointer text-sm"
              >
                {t('doctor.workspace.refresh') || "Try Again"}
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center px-4">
              <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <HugeiconsIcon icon={UserGroupIcon} className="w-10 h-10" />
              </div>
              <p className="text-xl font-black text-slate-800 mb-1">{t('admin.users.noResults')}</p>
              <p className="text-sm font-medium text-slate-500 max-w-sm">
                Try adjusting your search criteria, role filters, or status selection to find what you are looking for.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 sm:px-8 py-4">{t('admin.users.email')}</th>
                    <th className="px-6 py-4">{t('admin.users.role')}</th>
                    <th className="px-6 py-4">{t('admin.users.verification')}</th>
                    <th className="px-6 py-4">{t('admin.users.status')}</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((user) => {
                    const isActive = user.status?.toLowerCase() === "active";
                    const statusText = isActive 
                      ? (t('admin.users.active') && !t('admin.users.active').startsWith('admin.') ? t('admin.users.active') : "Active")
                      : (t('admin.users.suspended') && !t('admin.users.suspended').startsWith('admin.') ? t('admin.users.suspended') : "Suspended");

                    return (
                      <tr 
                        key={user.userId} 
                        className="transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
                        onClick={() => {
                          startTransition(() => {
                            router.push(`/admin/users/${user.userId}`);
                          });
                        }}
                      >
                        <td className="whitespace-nowrap px-6 sm:px-8 py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {user.email ? user.email[0].toUpperCase() : "U"}
                            </div>
                            <span className="truncate max-w-xs md:max-w-md">{user.email}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                            user.userType === 'Admin' 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : user.userType === 'Doctor' 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                            user.identityVerificationStatus === 'Verified'
                              ? 'text-emerald-600'
                              : user.identityVerificationStatus === 'Pending'
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              user.identityVerificationStatus === 'Verified'
                                ? 'bg-emerald-500'
                                : user.identityVerificationStatus === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}></span>
                            {user.identityVerificationStatus || "Unverified"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-slate-400">
                          <HugeiconsIcon icon={ArrowRight02Icon} className="w-5 h-5 ml-auto inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Premium Pagination Bar */}
          {!isUsersLoading && !usersError && items.length > 0 && (
            <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-500">
                {t('doctor.patients.page') || "Page"} <span className="text-slate-900 font-black">{page}</span> {t('ui.of') || "of"} <span className="text-slate-900 font-black">{totalPages}</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  disabled={!canGoPrevious}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-black text-sm hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                  <span>{t('doctor.patients.previous') || "Previous"}</span>
                </button>
                
                <span className="text-sm font-black bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-900 select-none">
                  {page}
                </span>
                
                <button 
                  disabled={!canGoNext}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-black text-sm hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200"
                >
                  <span>{t('doctor.patients.next') || "Next"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
