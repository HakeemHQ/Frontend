"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
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

export default function UserDetailsPage() {
  const { t } = useLanguage();
  const { id } = useParams() as { id: string };
  const { users, updateUserStatus, fetchUsers } = useAdminStore();
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // If user navigated directly here, users list might be empty.
  // We'll trigger a fetch just in case, or we can just rely on what's there.
  // To keep it simple, we'll try to find the user in the existing list.
  useEffect(() => {
    if (!users || users.items.length === 0) {
      // We don't have the current state (e.g. page/search) from the users list,
      // so fetching might just fetch page 1. It's better than nothing.
      fetchUsers({ page: 1, pageSize: 50 });
    }
  }, [users, fetchUsers]);

  const currentUser = users?.items.find((u) => u.userId === id);

  const handleStatusChange = async () => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    setToast(null);
    const isCurrentlyActive = currentUser.status.toLowerCase() === "active";
    const newStatus = isCurrentlyActive ? "Suspended" : "Active";
    
    try {
      await updateUserStatus(currentUser.userId, newStatus);
      setToast({ message: t('admin.users.statusUpdateSuccess'), type: "success" });
      setIsConfirming(false);
    } catch (error: any) {
      let message = t('admin.users.updateError');
      if (error.response?.status === 422) {
        message = error.response.data?.message || t('admin.users.invalidTransition');
      }
      setToast({ message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!users) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-500">{t('admin.users.loading')}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500">
        <p>{t('admin.users.notFound')}</p>
        <Link href="/admin/users" className="mt-4 text-blue-600 hover:underline">
          {t('admin.users.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <Modal 
        isOpen={isConfirming} 
        onClose={() => setIsConfirming(false)} 
        title={currentUser.status.toLowerCase() === "active" ? t('admin.users.suspendUser') : t('admin.users.activateUser')}
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            {currentUser.status.toLowerCase() === "active" ? t('admin.users.confirmSuspend') : t('admin.users.confirmActivate')}{" "}
            <span className="font-semibold text-slate-900">{currentUser.email}</span>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsConfirming(false)} disabled={isUpdating}>
              {t('admin.users.cancel')}
            </Button>
            <Button 
              onClick={handleStatusChange} 
              disabled={isUpdating}
              className={currentUser.status.toLowerCase() === "active" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {isUpdating ? t('admin.users.updating') : t('admin.users.confirm')}
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/admin/users" className="flex items-center gap-1 transition hover:text-slate-900">
          <ChevronLeftIcon className="h-4 w-4" />
          {t('admin.users.title')}
        </Link>
        <span>/</span>
        <span className="text-blue-600">{t('admin.users.detailsTitle')}</span>
      </nav>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 overflow-hidden relative">
               <UserAvatarPlaceholder />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {currentUser.email}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{currentUser.userType}</p>
              <div className={`mt-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                currentUser.status.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {currentUser.status.toLowerCase() === 'active' ? t('admin.users.active') : t('admin.users.suspended')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-8 py-8 md:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.users.email')}</h3>
            <p className="font-semibold text-slate-900">{currentUser.email}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.users.role')}</h3>
            <p className="font-semibold text-slate-900">{currentUser.userType}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.users.verificationStatus')}</h3>
            <p className="font-semibold text-slate-900">
              {currentUser.identityVerificationStatus || "-"}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">{t('admin.users.userId')}</h3>
            <p className="font-mono text-sm font-medium text-slate-400 select-none">
              {currentUser.userId}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 relative">
          <div className="flex gap-4">
            <Button 
              className={currentUser.status.toLowerCase() === "active" ? "bg-red-600 hover:bg-red-700 shadow-none border border-transparent text-white" : "bg-emerald-600 hover:bg-emerald-700 shadow-none border border-transparent text-white"}
              onClick={() => setIsConfirming(true)}
            >
              {currentUser.status.toLowerCase() === "active" ? t('admin.users.suspendUser') : t('admin.users.activateUser')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
