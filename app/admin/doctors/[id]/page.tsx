"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const UserAvatarPlaceholder = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const specialtyOptions = [
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "internal-medicine", label: "Internal Medicine" },
];

export default function DoctorDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [doctor, setDoctor] = useState({
    name: "Dr. Ahmed Hassan",
    specialty: "cardiology",
    specialtyLabel: "Cardiology",
    status: "Active",
    email: "ahmed@hakeem.test",
    license: "EG-12345",
    userId: "usr_12345a67890abcdef",
    docId: "doc_12345a67890abcdef"
  });

  const [editForm, setEditForm] = useState({ ...doctor });

  const handleSave = () => {
    const updatedSpecialtyLabel = specialtyOptions.find(o => o.value === editForm.specialty)?.label || editForm.specialty;
    
    setDoctor({ 
      ...editForm,
      specialtyLabel: updatedSpecialtyLabel
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...doctor });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/admin/doctors" className="flex items-center gap-1 transition hover:text-slate-900">
          <ChevronLeftIcon className="h-4 w-4" />
          Doctors
        </Link>
        <span>/</span>
        <span className="text-blue-600">Doctor Details</span>
      </nav>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 overflow-hidden relative">
               <UserAvatarPlaceholder />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <Input 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-lg font-bold"
                  />
                  <div className="flex items-center gap-3">
                    <Select 
                      options={[{value: 'Active', label: 'Active'}, {value: 'Suspended', label: 'Suspended'}]}
                      value={editForm.status}
                      onChange={(val) => setEditForm({...editForm, status: val})}
                      className="w-32"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {doctor.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">{doctor.specialtyLabel}</p>
                  <div className={`mt-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                    doctor.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {doctor.status}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-8 py-8 md:grid-cols-2">
          <div className="space-y-1 z-10">
            <h3 className="text-sm font-medium text-slate-500">Email</h3>
            {isEditing ? (
              <Input 
                value={editForm.email} 
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            ) : (
              <p className="font-semibold text-slate-900">{doctor.email}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">License Number</h3>
            {isEditing ? (
              <Input 
                value={editForm.license} 
                onChange={(e) => setEditForm({...editForm, license: e.target.value})}
              />
            ) : (
              <p className="font-semibold text-slate-900">{doctor.license}</p>
            )}
          </div>
          
          <div className="space-y-1 z-20">
            <h3 className="text-sm font-medium text-slate-500">Specialty</h3>
            {isEditing ? (
              <Select 
                options={specialtyOptions}
                value={editForm.specialty}
                onChange={(val) => setEditForm({...editForm, specialty: val})}
              />
            ) : (
              <p className="font-semibold text-slate-900">{doctor.specialtyLabel}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">User ID</h3>
            <p className="font-mono text-sm font-medium text-slate-400 cursor-not-allowed select-none" title="Cannot edit ID">{doctor.userId}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">Doctor ID</h3>
            <p className="font-mono text-sm font-medium text-slate-400 cursor-not-allowed select-none" title="Cannot edit ID">{doctor.docId}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                <EditIcon />
                Edit Profile
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-600 shadow-none border border-transparent">
                Suspend Doctor
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
