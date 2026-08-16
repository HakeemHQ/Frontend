"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/store/useProfileStore";
import { getDoctorProfile, DoctorProfile } from "@/lib/api/profile";
import { Toast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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
    <div className="space-y-10 pb-12 max-w-4xl mx-auto relative">
      <AnimatePresence>
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </AnimatePresence>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          {t('doctor.profile.title')}
        </h1>
        <p className="text-slate-500 text-base">
          {t('doctor.profile.description')}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-slate-100/80 bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative min-h-[400px]"
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
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100/80 pb-10 mb-10">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50">
                <UserIcon className="w-12 h-12" />
              </div>
              <div className="text-center sm:text-left rtl:sm:text-right pt-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{doc.fullName}</h2>
                <p className="text-slate-500 font-medium mt-1 text-lg">{doc.specialty}</p>
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 mt-4">
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <span className="text-sm font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.email')}</span>
                <span className="text-base font-semibold text-slate-900">{doc.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <span className="text-sm font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.licenseNumber')}</span>
                <span className="text-base font-semibold text-slate-900">{doc.licenseNumber || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <span className="text-sm font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.specialty')}</span>
                <span className="text-base font-semibold text-slate-900">{doc.specialty}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <span className="text-sm font-bold text-slate-500 mb-1 sm:mb-0">{t('doctor.profile.status')}</span>
                <span className="text-base font-bold text-emerald-600 uppercase tracking-wide text-sm">{doc.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <span className="text-sm font-bold text-slate-500 mb-1 sm:mb-0">{t('admin.doctors.doctorId')}</span>
                <span className="text-base font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-sm">{doc.doctorId}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 min-h-[300px]">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-lg text-slate-900">{t('ui.noDataFound')}</p>
          </div>
        )}

        {doc && (
          <div className="mt-12 pt-6 border-t border-slate-100/80">
            <Button 
              className="w-full sm:w-auto px-8 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all font-semibold"
              onClick={() => router.push('/doctor/profile/change-password')}
            >
              {t('doctor.profile.changePassword')}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
