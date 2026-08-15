"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";

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

const actionOptions = [
  { value: "", label: "All Actions" },
  { value: "Create", label: "Create" },
  { value: "Update", label: "Update" },
  { value: "Delete", label: "Delete" },
  { value: "Login", label: "Login" },
];

export default function AuditLogsPage() {
  const { auditLogs, isAuditLogsLoading, auditLogsError, fetchAuditLogs } = useAdminStore();
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  
  const handleActionChange = (val: string) => {
    setActionFilter(val);
    setPage(1);
  };

  // Fetch Data
  useEffect(() => {
    fetchAuditLogs({
      actorUserId: debouncedSearch.trim() || undefined,
      action: actionFilter || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page,
      pageSize
    });
  }, [debouncedSearch, actionFilter, fromDate, toDate, page, fetchAuditLogs]);

  const totalPages = auditLogs?.totalCount ? Math.ceil(auditLogs.totalCount / pageSize) : 1;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Audit Logs
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-1.5 w-full flex-1 z-30">
          <label className="text-sm font-medium text-slate-700">Search Actor ID</label>
          <Input
            placeholder="Search by User ID"
            iconLeft={<SearchIcon className="h-4 w-4" />}
            className="bg-white"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="space-y-1.5 w-full sm:w-48 z-20">
          <label className="text-sm font-medium text-slate-700">Action</label>
          <Select 
            options={actionOptions}
            value={actionFilter}
            onChange={handleActionChange}
          />
        </div>

        <div className="space-y-1.5 w-full sm:w-40 z-10">
          <label className="text-sm font-medium text-slate-700">From Date</label>
          <Input 
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            className="bg-white"
          />
        </div>
        
        <div className="space-y-1.5 w-full sm:w-40 z-10">
          <label className="text-sm font-medium text-slate-700">To Date</label>
          <Input 
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            className="bg-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isAuditLogsLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : auditLogsError ? (
          <div className="flex flex-col justify-center items-center h-48 text-red-500">
            <p>{auditLogsError}</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              onClick={() => fetchAuditLogs({ actorUserId: debouncedSearch.trim() || undefined, action: actionFilter || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, page, pageSize })}
            >
              Retry
            </button>
          </div>
        ) : (!auditLogs?.items || auditLogs.items.length === 0) ? (
          <div className="flex justify-center items-center h-48 text-slate-500">
            <p>No audit logs found for the given criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.items.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {log.actorName || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.details}>
                      {log.details || "-"}
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
