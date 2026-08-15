"use client";

import React, { useState, useEffect } from "react";
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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Audit Logs
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-1.5 w-full flex-1 z-30">
          <label className="text-sm font-medium text-slate-700">Action</label>
          <Input
            placeholder="e.g. ExtractedItemReviewed"
            className="bg-white"
            value={actionFilter}
            onChange={handleActionChange}
          />
        </div>
        <div className="space-y-1.5 w-full flex-1 z-20">
          <label className="text-sm font-medium text-slate-700">Actor User ID</label>
          <Input
            placeholder="Filter by user ID"
            className="bg-white"
            value={actorUserIdFilter}
            onChange={handleActorChange}
          />
        </div>
        <div className="space-y-1.5 w-full sm:w-40 z-10">
          <label className="text-sm font-medium text-slate-700">From Date</label>
          <Input 
            type="date" 
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </div>
        <div className="space-y-1.5 w-full sm:w-40 z-10">
          <label className="text-sm font-medium text-slate-700">To Date</label>
          <Input 
            type="date" 
            value={toDate}
            onChange={handleToDateChange}
          />
        </div>
      </div>
      
      {dateError && <p className="text-sm text-red-500">{dateError}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
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
            <p>No audit events found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Audit ID</th>
                  <th className="px-6 py-4">Actor User ID</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Occurred At</th>
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

      {!isAuditLogsLoading && !auditLogsError && (auditLogs?.items?.length ?? 0) > 0 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon />
          </button>
          
          <span className="text-sm text-slate-600 font-medium px-4">
            Page {page} of {totalPages}
          </span>
          
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
