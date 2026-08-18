"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/localization/LanguageContext";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  Shield01Icon 
} from "@hugeicons/core-free-icons";

export default function AuditLogsPage() {
  const { t } = useLanguage();
  const { auditLogs, isAuditLogsLoading, auditLogsError, fetchAuditLogs } = useAdminStore();
  
  const [actionFilter, setActionFilter] = useState("");
  const [actorUserIdFilter, setActorUserIdFilter] = useState("");
  const [debouncedAction, setDebouncedAction] = useState("");
  const [debouncedActor, setDebouncedActor] = useState("");
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAction(actionFilter);
      setDebouncedActor(actorUserIdFilter);
    }, 350);
    return () => clearTimeout(handler);
  }, [actionFilter, actorUserIdFilter]);

  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionFilter(e.target.value);
    setPage(1);
  };

  const handleActorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActorUserIdFilter(e.target.value);
    setPage(1);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    setPage(1);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    setPage(1);
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if ((fromDate && fromDate > today) || (toDate && toDate > today)) {
      setDateError(t('admin.auditLogs.futureDateError') || "Selected dates cannot be in the future");
      return;
    }
    if (fromDate && toDate && fromDate > toDate) {
      setDateError(t('admin.auditLogs.dateError') || "From Date cannot be after To Date");
      return;
    }
    setDateError("");
    
    fetchAuditLogs({
      action: debouncedAction.trim() || undefined,
      actorUserId: debouncedActor.trim() || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page,
      pageSize
    });
  }, [debouncedAction, debouncedActor, fromDate, toDate, page, fetchAuditLogs, today, t]);

  const totalPages = auditLogs?.total ? Math.ceil(auditLogs.total / pageSize) : 1;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              {t('admin.auditLogs.systemLogs')}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 font-medium">{t('admin.auditLogs.detailedLogs')}</p>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-md border border-white/20">
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">{t('admin.auditLogs.action')}</span>
              <input
                dir="auto"
                placeholder={t('admin.auditLogs.actionPlaceholder')}
                className="w-full bg-white/20 border border-white/10 text-white rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                value={actionFilter}
                onChange={handleActionChange}
              />
            </div>
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">{t('admin.auditLogs.actorUserId')}</span>
              <input
                placeholder={t('admin.auditLogs.filterByUser')}
                className="w-full bg-white/20 border border-white/10 text-white rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                value={actorUserIdFilter}
                onChange={handleActorChange}
              />
            </div>
            
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">{t('admin.auditLogs.fromDate')}</span>
              <input 
                type="date" 
                max={today}
                value={fromDate}
                onChange={handleFromDateChange}
                className="w-full bg-white/20 border border-white/10 text-white rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-white outline-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="sm:col-span-3">
              <span className="text-xs font-bold text-white/70 mb-1 uppercase tracking-wider pl-1 block">{t('admin.auditLogs.toDate')}</span>
              <input 
                type="date" 
                max={today}
                value={toDate}
                onChange={handleToDateChange}
                className="w-full bg-white/20 border border-white/10 text-white rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-white outline-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {dateError && <p className="text-sm text-red-500 font-semibold px-2 mb-4">{dateError}</p>}

      {/* Main Table */}
      <div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isAuditLogsLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : auditLogsError ? (
          <div className="flex flex-col justify-center items-center py-12 text-red-500">
            <p className="text-sm font-semibold">{auditLogsError}</p>
          </div>
        ) : (!auditLogs?.items || auditLogs.items.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center px-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
              <HugeiconsIcon icon={Shield01Icon} className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-800 mb-1">{t('admin.auditLogs.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">{t('admin.auditLogs.auditId')}</th>
                  <th className="px-5 py-3.5">{t('admin.auditLogs.actorUserId')}</th>
                  <th className="px-5 py-3.5">{t('admin.auditLogs.action')}</th>
                  <th className="px-5 py-3.5">{t('admin.auditLogs.target')}</th>
                  <th className="px-5 py-3.5">{t('admin.auditLogs.occurredAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs?.items?.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">
                      {log.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-slate-700">
                      {log.actorUserId}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs font-mono text-slate-500">
                      {log.target}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
                      {new Date(log.occurredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Compact Pagination */}
        {!isAuditLogsLoading && !auditLogsError && (auditLogs?.items?.length ?? 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {t('ui.page')} {page} {t('ui.of')} {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t('doctor.patients.previous') || "Previous"}</span>
              </button>
              
              <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-800 select-none">
                {page}
              </span>
              
              <button 
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
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
