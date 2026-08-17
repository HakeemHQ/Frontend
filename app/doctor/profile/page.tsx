"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";
import { getDoctorProfile, DoctorProfile } from "@/lib/api/profile";
import { Toast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";

export default function DoctorProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { profile, setProfile, isLoading, setIsLoading, error, setError } = useProfileStore();
  
  useEffect(() => {
    let mounted = true;
    
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const profile = await getDoctorProfile();
        if (mounted) {
          setProfile(profile);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.response?.data?.message || "Failed to fetch profile");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (!profile || !('doctorId' in (profile as any))) {
      fetchProfile();
    }
    
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = profile as DoctorProfile;

  return (
    <div className="pb-12 max-w-4xl mx-auto px-4 sm:px-6">
      <AnimatePresence>
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </AnimatePresence>
      
      {/* Hero Section */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
            {t('doctor.profile.title')}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-white/80 font-medium max-w-xl">
            {t('doctor.profile.description')}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8"
      >
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="h-16 w-16 rounded-2xl bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-48"></div>
                <div className="h-3 bg-slate-200 rounded w-28"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : doc ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <HugeiconsIcon icon={UserCircleIcon} className="w-9 h-9" />
              </div>
              <div className="text-center sm:text-left rtl:sm:text-right">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{doc.fullName}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.specialty}</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-700 border border-emerald-200 mt-2">
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('doctor.profile.email')}</span>
                <span className="text-sm font-bold text-slate-900 mt-1 truncate">{doc.email}</span>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('doctor.profile.licenseNumber')}</span>
                <span className="text-sm font-bold text-slate-900 mt-1">{doc.licenseNumber || "N/A"}</span>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('doctor.profile.specialty')}</span>
                <span className="text-sm font-bold text-slate-900 mt-1">{doc.specialty}</span>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('admin.doctors.doctorId')}</span>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mt-1 self-start">{doc.doctorId}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <HugeiconsIcon icon={UserCircleIcon} className="w-10 h-10 mb-2 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">{t('ui.noDataFound')}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}