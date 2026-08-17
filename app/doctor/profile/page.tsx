"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
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
    <div className="pb-12 max-w-6xl mx-auto relative px-4 sm:px-6 mt-4">
      <AnimatePresence>
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </AnimatePresence>
      
      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={UserCircleIcon} className="w-[500px] h-[500px]" />
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.profile.title')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl">
            {t('doctor.profile.description')}
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-5xl border-0 min-h-[400px]"
      >
        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100/80 pb-10 mb-10">
              <div className="h-28 w-28 shrink-0 rounded-3xl bg-slate-100"></div>
              <div className="flex flex-col items-center sm:items-start pt-2 w-full sm:w-1/2">
                <div className="h-8 bg-slate-100 rounded-md w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-50 rounded-md w-1/2 mb-5"></div>
                <div className="h-6 bg-slate-100 rounded-md w-24 mt-2"></div>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-50/50 last:border-0">
                  <div className="h-4 bg-slate-100 rounded-md w-1/4 mb-2 sm:mb-0"></div>
                  <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="h-14 bg-slate-100 rounded-2xl w-full sm:w-48"></div>
            </div>
          </div>
        ) : doc ? (
          <>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b-2 border-slate-100 pb-12 mb-12">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[32px] bg-primary/10 text-primary shadow-sm border-2 border-primary/20">
                <HugeiconsIcon icon={UserCircleIcon} className="w-16 h-16" />
              </div>
              <div className="text-center sm:text-left rtl:sm:text-right pt-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{doc.fullName}</h2>
                <p className="text-slate-500 font-medium mt-1 text-lg">{doc.specialty}</p>
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 mt-4">
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors">
                <span className="text-lg font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.email')}</span>
                <span className="text-xl font-black text-slate-900">{doc.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors">
                <span className="text-lg font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.licenseNumber')}</span>
                <span className="text-xl font-black text-slate-900">{doc.licenseNumber || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors">
                <span className="text-lg font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.specialty')}</span>
                <span className="text-xl font-black text-slate-900">{doc.specialty}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors">
                <span className="text-lg font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.status')}</span>
                <span className="text-lg font-black text-emerald-600 uppercase tracking-widest">{doc.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors">
                <span className="text-lg font-bold text-slate-500 mb-1 sm:mb-0">{t('admin.doctors.doctorId')}</span>
                <span className="text-lg font-mono text-primary font-bold bg-primary/10 px-4 py-2 rounded-xl">{doc.doctorId}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 min-h-[300px]">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <HugeiconsIcon icon={UserCircleIcon} className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-lg text-slate-900">{t('ui.noDataFound')}</p>
          </div>
        )}


      </motion.div>
    </div>
  );
}