"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const patients = [
  { 
    id: 1, 
    name: "Mazen Mohamed", 
    code: "H89K-27P", 
    status: "Access active", 
    statusColor: "text-emerald-500",
    time: "01:23:45",
    timeColor: "text-emerald-500"
  },
  { 
    id: 2, 
    name: "Nada Ahmed", 
    code: "A13B-09C", 
    status: "Access expires in", 
    statusColor: "text-orange-500",
    time: "00:45:12",
    timeColor: "text-orange-500"
  },
  { 
    id: 3, 
    name: "Ali Hassan", 
    code: "70BE-7TY", 
    status: "Access active", 
    statusColor: "text-emerald-500",
    time: "02:15:30",
    timeColor: "text-emerald-500"
  }
];

export default function ActivePatientsPage() {
  return (
    <div className="space-y-8 pb-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Active Patients
          </h1>
          <p className="text-slate-500 text-sm">
            These are the patients you have active access to.<br/>
            Access is temporary and expires.
          </p>
        </div>
        <Link href="/doctor/patients/verify-identity">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
            Verify Patient
          </Button>
        </Link>
      </div>

      <div className="w-full">
        <Input
          placeholder="Search by patient name or code"
          iconLeft={<SearchIcon className="h-5 w-5 text-slate-400" />}
          className=" shadow-sm border-slate-100 rounded-xl"
        />
      </div>

      <div className="space-y-4 flex flex-col gap-2">
        {patients.map((patient) => (
          <Link key={patient.id} href={`/doctor/patients/workspace/${patient.code}`}>
            <div 
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-surface shadow-sm transition hover:shadow-md hover:border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                  <p className="text-sm text-slate-500">Code: {patient.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${patient.statusColor}`}>
                  {patient.status}
                </p>
                <p className={`text-xl font-bold tabular-nums ${patient.timeColor}`}>
                  {patient.time}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
