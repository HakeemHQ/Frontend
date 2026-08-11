"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

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

const doctors = [
  { id: 1, name: "Dr. Ahmed Hassan", specialty: "Cardiology", license: "EG-12345", status: "Active", createdAt: "Aug 10, 2026" },
  { id: 2, name: "Dr. Sara Ali", specialty: "Neurology", license: "EG-67890", status: "Active", createdAt: "Aug 9, 2026" },
  { id: 3, name: "Dr. Mohamed Farouk", specialty: "Internal Medicine", license: "EG-33445", status: "Active", createdAt: "Aug 8, 2026" },
  { id: 4, name: "Dr. Lina Fawzi", specialty: "Pediatrics", license: "EG-44166", status: "Suspended", createdAt: "Aug 7, 2026" },
  { id: 5, name: "Dr. Omar Khaled", specialty: "Orthopedics", license: "EG-56667", status: "Active", createdAt: "Aug 6, 2026" },
];

const specialtyOptions = [
  { value: "all", label: "All" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export default function DoctorsListPage() {
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Doctors
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by name, email or license"
              iconLeft={<SearchIcon className="h-4 w-4" />}
              className="bg-white"
            />
          </div>
          <Link href="/admin/doctors/add" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              <PlusIcon />
              Add Doctor
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="space-y-1.5 w-full sm:w-48 z-20">
          <label className="text-sm font-medium text-slate-700">Specialty</label>
          <Select 
            options={specialtyOptions}
            value={specialtyFilter}
            onChange={setSpecialtyFilter}
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
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Specialty</th>
                <th className="px-6 py-4">License Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doctor) => (
                <tr 
                  key={doctor.id} 
                  onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
                  className="transition-colors hover:bg-slate-50 cursor-pointer"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {doctor.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{doctor.specialty}</td>
                  <td className="whitespace-nowrap px-6 py-4">{doctor.license}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        doctor.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{doctor.createdAt}</td>
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
