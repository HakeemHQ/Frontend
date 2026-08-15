"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { useAdminStore } from "@/store/useAdminStore";
import { useLanguage } from "@/localization/LanguageContext";

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const UserAvatarPlaceholder = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

export default function DoctorDetailsPage() {
  const { t } = useLanguage();
  const { id } = useParams() as { id: string };
  const { currentDoctor, isDoctorLoading, doctorError, fetchDoctor, updateDoctorStatus } = useAdminStore();
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (id) {
      fetchDoctor(id);
    }
  }, [id, fetchDoctor]);

  const handleStatusChange = async () => {
    if (!currentDoctor) return;
    
    setIsUpdating(true);
    setToast(null);
    const isCurrentlyActive = currentDoctor.status.toLowerCase() === "active";
    const newStatus = isCurrentlyActive ? "Suspended" : "Active";
    
    try {
      await updateDoctorStatus(currentDoctor.id, newStatus);
      setToast({ message: t('admin.doctors.statusUpdateSuccess'), type: "success" });
      setIsConfirming(false);
    } catch (error: any) {
      let message = t('admin.doctors.updateError');
      if (error.response?.status === 422) {
        message = error.response.data?.message || t('admin.doctors.invalidTransition');
      }
      setToast({ message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDoctorLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (doctorError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <p>{doctorError}</p>
        <Link href="/admin/doctors" className="mt-4 text-blue-600 hover:underline">
          {t('admin.doctors.back')}
        </Link>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500">
        <p>{t('admin.doctors.notFound')}</p>
        <Link href="/admin/doctors" className="mt-4 text-blue-600 hover:underline">
          {t('admin.doctors.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/admin/doctors" className="flex items-center gap-1 transition hover:text-slate-900">
          <ChevronLeftIcon className="h-4 w-4" />
          {t('admin.doctors.title')}
        </Link>
        <span>/</span>
        <span className="text-blue-600">{t('admin.doctors.detailsTitle')}</span>
      </nav>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 overflow-hidden relative">
               <UserAvatarPlaceholder />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {currentDoctor.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{currentDoctor.specialty}</p>
              <div className={`mt-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                currentDoctor.status.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {currentDoctor.status.toLowerCase() === 'active' ? t('admin.doctors.active') : t('admin.doctors.suspended')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-8 py-8 md:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.doctors.email')}</h3>
            <p className="font-semibold text-slate-900">{currentDoctor.email}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.doctors.licenseNumber')}</h3>
            <p className="font-semibold text-slate-900">{currentDoctor.licenseNumber}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.doctors.createdAt')}</h3>
            <p className="font-semibold text-slate-900">
              N/A
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.doctors.userId')}</h3>
            <p className="font-mono text-sm font-medium text-slate-400 select-none">
              N/A
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.doctors.doctorId')}</h3>
            <p className="font-mono text-sm font-medium text-slate-400 select-none">
              {currentDoctor.id}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 relative">
          {isConfirming ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 w-full">
              <p className="text-sm text-red-800 font-medium mb-4">
                {currentDoctor.status.toLowerCase() === "active" ? t('admin.doctors.confirmSuspend') : t('admin.doctors.confirmActivate')}
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsConfirming(false)} 
                  disabled={isUpdating}
                >
                  {t('admin.doctors.cancel')}
                </Button>
                <Button 
                  className={currentDoctor.status.toLowerCase() === "active" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
                  onClick={handleStatusChange} 
                  disabled={isUpdating}
                >
                  {isUpdating ? t('admin.doctors.processing') : t('admin.doctors.confirm')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button 
                className={currentDoctor.status.toLowerCase() === "active" ? "bg-red-600 hover:bg-red-700 shadow-none border border-transparent text-white" : "bg-emerald-600 hover:bg-emerald-700 shadow-none border border-transparent text-white"}
                onClick={() => setIsConfirming(true)}
              >
                {currentDoctor.status.toLowerCase() === "active" ? t('admin.doctors.suspendDoctor') : t('admin.doctors.activateDoctor')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
