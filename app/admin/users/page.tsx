"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

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

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const users = [
  { id: 1, name: "Omar Khaled", role: "Patient", status: "Active", lastLogin: "Aug 10, 2026, 10:30 AM" },
  { id: 2, name: "Sara Ali", role: "Admin", status: "Active", lastLogin: "Aug 10, 2026, 09:15 AM" },
  { id: 3, name: "Ahmed Hassan", role: "Doctor", status: "Suspended", lastLogin: "Aug 9, 2026, 14:20 PM" },
  { id: 4, name: "Youssef Nabil", role: "Patient", status: "Active", lastLogin: "Aug 9, 2026, 11:10 AM" },
  { id: 5, name: "Lina Fawzi", role: "Doctor", status: "Active", lastLogin: "Aug 8, 2026, 16:45 PM" },
];

const roleOptions = [
  { value: "all", label: "All" },
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "admin", label: "Admin" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export default function UsersListPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Users
        </h1>
        
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-1.5 w-full flex-1 z-30">
          <label className="text-sm font-medium text-slate-700">Search</label>
          <Input
            placeholder="Search users..."
            iconLeft={<SearchIcon className="h-4 w-4" />}
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5 w-full sm:w-48 z-20">
          <label className="text-sm font-medium text-slate-700">Role</label>
          <Select 
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
          />
        </div>
        <div className="space-y-1.5 w-full sm:w-48 z-10">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select 
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-600' :
                      user.role === 'Doctor' ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{user.lastLogin}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 pt-4">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <ChevronLeftIcon />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
          1
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
          2
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
          3
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
