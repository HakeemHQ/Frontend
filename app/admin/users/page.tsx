"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";
import { Select } from "@/components/ui/Select";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  UserGroupIcon, 
  Search01Icon, 
  Cancel01Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              {t('admin.users.title')}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 font-medium max-w-2xl">
              {t('admin.users.subtitle') || "Manage patient, doctor, and admin system accounts across the platform"}
            </p>
          </div>
          
          {/* Filters Bar inside Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-md border border-white/20">
            {/* Search Input */}
            <div className="sm:col-span-6">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">
                {t('nav.search')}
              </span>
              <div className="relative">
                <HugeiconsIcon icon={Search01Icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder={t('admin.users.searchPlaceholder')}
                  className="w-full bg-white/20 border border-white/10 text-white rounded-lg pl-10 pr-8 py-2.5 text-sm font-medium focus:ring-2 focus:ring-white outline-none placeholder-white/50 transition-all"
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer p-1 transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-3">
              <Select
                variant="hero"
                label={t('admin.users.role')}
                options={roleOptions}
                value={userTypeFilter}
                onChange={handleRoleChangeFilter}
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <Select
                variant="hero"
                label={t('admin.users.status')}
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
          {/* Header Info Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/75">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                {isUsersLoading ? (
                  t('common.loading')
                ) : items.length > 0 ? (
                  <>
                    {t('doctor.patients.title') || "Showing"} <span className="text-slate-900 font-bold">{items.length}</span> {t('admin.users.title')?.toLowerCase() || "users"} (Page {page} of {totalPages})
                  </>
                ) : (
                  t('admin.users.noResults')
                )}
              </span>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('ui.pageSize') || "Per page"}:
              </span>
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer ${
                      pageSize === size
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
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
            <div className="p-6 space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl w-full flex items-center justify-between px-5">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-5 bg-slate-200 rounded-full w-14"></div>
                </div>
              ))}
            </div>
          ) : usersError ? (
            <div className="flex flex-col justify-center items-center py-12 text-rose-500 gap-3">
              <p className="font-semibold text-sm">{usersError}</p>
              <button 
                onClick={() => fetchUsers({ search: debouncedSearch.trim() || undefined, userType: userTypeFilter || undefined, status: statusFilter || undefined, page, pageSize })}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-semibold border border-rose-200 hover:bg-rose-100 transition cursor-pointer text-xs"
              >
                {t('doctor.workspace.refresh') || "Try Again"}
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <HugeiconsIcon icon={UserGroupIcon} className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-slate-800 mb-1">{t('admin.users.noResults')}</p>
              <p className="text-xs font-normal text-slate-500 max-w-sm">
                Try adjusting your search criteria, role filters, or status selection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">{t('admin.users.email')}</th>
                    <th className="px-5 py-3.5">{t('admin.users.role')}</th>
                    <th className="px-5 py-3.5">{t('admin.users.verification')}</th>
                    <th className="px-5 py-3.5">{t('admin.users.status')}</th>
                    <th className="px-5 py-3.5 text-right"></th>
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
                        className="transition-colors duration-150 hover:bg-slate-50 cursor-pointer group"
                        onClick={() => {
                          startTransition(() => {
                            router.push(`/admin/users/${user.userId}`);
                          });
                        }}
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {user.email ? user.email[0].toUpperCase() : "U"}
                            </div>
                            <span className="truncate max-w-xs md:max-w-md group-hover:text-primary transition-colors text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            user.userType === 'Admin' 
                              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                              : user.userType === 'Doctor' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            user.identityVerificationStatus === 'Verified'
                              ? 'text-emerald-600'
                              : user.identityVerificationStatus === 'Pending'
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.identityVerificationStatus === 'Verified'
                                ? 'bg-emerald-500'
                                : user.identityVerificationStatus === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}></span>
                            {user.identityVerificationStatus || "Unverified"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {statusText}
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

          {/* Compact Pagination Bar */}
          {!isUsersLoading && !usersError && items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-500">
                {t('doctor.patients.page') || "Page"} <span className="text-slate-900 font-bold">{page}</span> {t('ui.of') || "of"} <span className="text-slate-900 font-bold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  disabled={!canGoPrevious}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{t('doctor.patients.previous') || "Previous"}</span>
                </button>
                
                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-800 select-none">
                  {page}
                </span>
                
                <button 
                  disabled={!canGoNext}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                >
                  <span>{t('doctor.patients.next') || "Next"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
