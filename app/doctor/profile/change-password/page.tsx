"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/localization/LanguageContext";

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

export default function ChangePasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate back to profile on success
    router.back();
  };

  // Determine password strength basic visually
  const isWeak = newPassword.length > 0;
  const isMedium = newPassword.length >= 8;
  const isStrong = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword);
  
  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 shrink-0 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">
          {t('doctor.profile.changePasswordTitle')}
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="bg-[#b3c7f1]/40 border border-[#b3c7f1]/60 rounded-lg p-4 flex items-start gap-3 mb-8">
          <ShieldIcon className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-950 leading-relaxed font-medium">
            {t('doctor.profile.changePasswordDesc')}
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t('doctor.profile.currentPassword')}</label>
            <Input 
              type={showCurrent ? "text" : "password"}
              placeholder={t('doctor.profile.passwordPlaceholder')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white"
              iconLeft={<LockIcon className="w-5 h-5 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showCurrent ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <div className="border-t border-slate-100 my-6"></div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t('doctor.profile.newPassword')}</label>
            <Input 
              type={showNew ? "text" : "password"}
              placeholder={t('doctor.profile.passwordPlaceholder')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white"
              iconLeft={<LockIcon className="w-5 h-5 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNew ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              }
            />
            
            {/* Password Strength Indicator */}
            <div className="pt-2">
              <div className="flex gap-2 mb-2">
                <div className={`h-1 flex-1 rounded-full ${isWeak ? 'bg-blue-200' : 'bg-slate-100'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${isMedium ? 'bg-blue-300' : 'bg-slate-100'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${isStrong ? 'bg-blue-500' : 'bg-slate-100'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${isStrong && newPassword.length >= 10 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500">
                  {t('doctor.profile.passwordStrength')}: {isStrong ? t('doctor.profile.strengthStrong') : isMedium ? t('doctor.profile.strengthMedium') : t('doctor.profile.strengthWeak')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t('doctor.profile.confirmPassword')}</label>
            <Input 
              type={showConfirm ? "text" : "password"}
              placeholder={t('doctor.profile.passwordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white"
              iconLeft={<LockIcon className="w-5 h-5 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirm ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm text-base">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
