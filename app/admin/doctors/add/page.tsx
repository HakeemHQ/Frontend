"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const specialtyOptions = [
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
];

export default function AddDoctorPage() {
  const [specialty, setSpecialty] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect
    router.push("/admin/doctors");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/admin/doctors" className="flex items-center gap-1 transition hover:text-slate-900">
          <ChevronLeftIcon className="h-4 w-4" />
          Doctors
        </Link>
        <span>/</span>
        <span className="text-blue-600">Add Doctor</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Add Doctor
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new doctor account.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <Input placeholder="Dr. Ahmed Hassan" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input type="email" placeholder="ahmed@hakeem.test" />
          </div>
          
          <div className="space-y-1.5 z-50">
            <label className="text-sm font-medium text-slate-700">Specialty</label>
            <Select 
              options={specialtyOptions}
              value={specialty}
              onChange={setSpecialty}
              placeholder="Select specialty"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">License Number</label>
            <Input placeholder="EG-12345" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Temporary Password</label>
            <Input 
              type="text" 
              defaultValue="TempPassword21" 
              iconRight={
                <div className="flex items-center gap-2">
                  <button type="button" className="text-slate-400 hover:text-slate-600">
                    <RefreshIcon />
                  </button>
                  <button type="button" className="text-slate-400 hover:text-slate-600">
                    <EyeIcon />
                  </button>
                </div>
              } 
            />
          </div>
          
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-blue-700">
            <InfoIcon className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              The doctor will be required to change this password on first login.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/admin/doctors">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              Create Doctor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
