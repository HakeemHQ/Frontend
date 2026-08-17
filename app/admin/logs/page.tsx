"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/localization/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";

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
    }, 500);
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

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setDateError("From Date cannot be after To Date");
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
  }, [debouncedAction, debouncedActor, fromDate, toDate, page, fetchAuditLogs]);

  const totalPages = auditLogs?.total ? Math.ceil(auditLogs.total / pageSize) : 1;

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[350px] flex flex-col justify-center">
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 font-heading">
              {t('admin.auditLogs.systemLogs')}
            </h1>
            <p className="text-xl text-white/80 font-medium">{t('admin.auditLogs.detailedLogs')}</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col xl:flex-row items-center gap-4 bg-white/10 p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl w-full">
            <div className="w-full xl:w-1/4">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.auditLogs.action')}</span>
              <input
                dir="auto"
                placeholder={t('admin.auditLogs.actionPlaceholder')}
                className="w-full bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                value={actionFilter}
                onChange={handleActionChange}
              />
            </div>
            <div className="w-full xl:w-1/4">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.auditLogs.actorUserId')}</span>
              <input
                placeholder={t('admin.auditLogs.filterByUser')}
                className="w-full bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none placeholder-white/50"
                value={actorUserIdFilter}
                onChange={handleActorChange}
              />
            </div>
            
            <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 flex-1">
              <div className="w-full sm:flex-1">
                <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.auditLogs.fromDate')}</span>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className="bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none w-full"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="w-full sm:flex-1">
                <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wider pl-2 block">{t('admin.auditLogs.toDate')}</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={handleToDateChange}
                  className="bg-white/20 border-none text-white rounded-[20px] px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-white outline-none w-full"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {dateError && <p className="text-lg text-red-500 font-bold px-8 -mt-8 relative z-20">{dateError}</p>}

      <div className="-mt-16 relative z-20 px-4 md:px-8">
        <div className="overflow-hidden rounded-[40px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        {isAuditLogsLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : auditLogsError ? (
          <div className="flex flex-col justify-center items-center h-48 text-red-500">
            <p>{auditLogsError}</p>
          </div>
        ) : (!auditLogs?.items || auditLogs.items.length === 0) ? (
          <div className="flex justify-center items-center h-48 text-slate-500">
            <p>{t('admin.auditLogs.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">{t('admin.auditLogs.auditId')}</th>
                  <th className="px-6 py-4">{t('admin.auditLogs.actorUserId')}</th>
                  <th className="px-6 py-4">{t('admin.auditLogs.action')}</th>
                  <th className="px-6 py-4">{t('admin.auditLogs.target')}</th>
                  <th className="px-6 py-4">{t('admin.auditLogs.occurredAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs?.items?.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {log.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {log.actorUserId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {log.action}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {log.target}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(log.occurredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>

      {!isAuditLogsLoading && !auditLogsError && (auditLogs?.items?.length ?? 0) > 0 && (
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
