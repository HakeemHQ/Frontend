"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
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

export default function UsersListPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { users, isUsersLoading, usersError, fetchUsers } = useAdminStore();

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
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChangeFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  useEffect(() => {
    fetchUsers({
      search: debouncedSearch.trim() || undefined,
      status: statusFilter || undefined,
      page,
      pageSize
    });
  }, [debouncedSearch, statusFilter, page, fetchUsers]);

  const totalPages = users?.total ? Math.ceil(users.total / pageSize) : 1;

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[350px] flex flex-col justify-center">
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 font-heading">
              {t('admin.users.title')}
            </h1>
            <p className="text-xl text-white/80 font-medium">{t('admin.users.subtitle')}</p>
          </div>
          
          {/* Filters inside Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl w-full max-w-3xl">
            <div className="w-full sm:flex-1">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('nav.search')}</span>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/50" />
                <input
                  placeholder={t('admin.users.searchPlaceholder')}
                  className="w-full bg-white/20 border-none text-white rounded-[20px] pl-12 pr-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.users.status')}</span>
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
        {isUsersLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : usersError ? (
          <div className="flex flex-col justify-center items-center h-48 text-red-500">
            <p>{usersError}</p>
          </div>
        ) : (!users?.items || users.items.length === 0) ? (
          <div className="flex justify-center items-center h-48 text-slate-500">
            <p>{t('admin.users.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">{t('admin.users.email')}</th>
                  <th className="px-6 py-4">{t('admin.users.role')}</th>
                  <th className="px-6 py-4">{t('admin.users.verification')}</th>
                  <th className="px-6 py-4">{t('admin.users.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users?.items?.map((user) => (
                  <tr 
                    key={user.userId} 
                    className="transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user.userId}`)}
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        user.userType === 'Admin' ? 'bg-purple-50 text-purple-600' :
                        user.userType === 'Doctor' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.identityVerificationStatus}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                          user.status.toLowerCase() === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.status.toLowerCase() === 'active' ? t('admin.users.active') : t('admin.users.suspended')}
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

      {!isUsersLoading && !usersError && (users?.items?.length ?? 0) > 0 && (
        <div className="flex items-center justify-center gap-1 pt-8 pb-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon />
          </button>
          
          <span className="text-lg text-slate-600 font-bold px-6">
            {t('ui.page')} {page} {t('ui.of')} {totalPages}
          </span>
          
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
