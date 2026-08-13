"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/store/useProfileStore";
import { getDoctorProfile, DoctorProfile } from "@/lib/api/profile";
import { Toast } from "@/components/ui/Toast";

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function DoctorProfilePage() {
  const router = useRouter();
  const { profile, setProfile, isLoading, setIsLoading, error, setError } = useProfileStore();
  
  useEffect(() => {
    let mounted = true;
    
    const fetchProfile = async () => {
      // Avoid re-fetching if we already have the doctor profile
      if (profile && 'doctorId' in profile) return; 
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getDoctorProfile();
        if (mounted) {
          setProfile(data);
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
    
    fetchProfile();
    return () => { mounted = false; };
  }, [profile, setProfile, setIsLoading, setError]);

  const doc = profile as DoctorProfile;

  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto relative">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          My Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your account details and password.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm relative min-h-[400px]">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8 mb-8">
              <div className="h-24 w-24 shrink-0 rounded-full bg-slate-200"></div>
              <div className="flex flex-col items-center sm:items-start pt-2 w-full sm:w-1/2">
                <div className="h-8 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded-md w-24 mt-1"></div>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4 mb-2 sm:mb-0"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="h-12 bg-slate-200 rounded-xl w-full sm:w-40"></div>
            </div>
          </div>
        ) : doc ? (
          <>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8 mb-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <UserIcon />
              </div>
              <div className="text-center sm:text-left pt-2">
                <h2 className="text-2xl font-bold text-slate-900">{doc.fullName}</h2>
                <p className="text-slate-500 font-medium mt-1">{doc.specialty}</p>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 mt-3">
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">Email</span>
                <span className="text-sm font-medium text-slate-900">{doc.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">License Number</span>
                <span className="text-sm font-medium text-slate-900">{doc.licenseNumber}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">Specialty</span>
                <span className="text-sm font-medium text-slate-900">{doc.specialty}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">Status</span>
                <span className="text-sm font-medium text-emerald-500">{doc.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                <span className="text-sm font-medium text-slate-500">Doctor ID</span>
                <span className="text-sm font-medium text-slate-900">{doc.doctorId}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            No profile data available.
          </div>
        )}

        {doc && (
          <div className="mt-10">
            <Button 
              className="w-full sm:w-auto px-8"
              onClick={() => router.push('/doctor/profile/change-password')}
            >
              Change Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
