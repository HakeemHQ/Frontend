"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  FileAddIcon,
  CheckmarkCircle02Icon,
  TextIcon,
  Target01Icon,
  DocumentValidationIcon
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePatientMedicalCvsStore } from "@/store/usePatientMedicalCvsStore";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

export default function NewMedicalCVPage({ params }: { params: Promise<{ code: string }> }) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { code } = use(params);

  const [title, setTitle] = useState("");
  const { createCv, isCreating, error: storeError, clearError } = usePatientMedicalCvsStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    // Clear global store error when navigating away so it doesn't leak to other pages
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);
    
    // Retrieve patientId from session storage
    const dataStr = sessionStorage.getItem(`access_${code}`);
    let patientId = "";
    if (dataStr) {
      try {
        const accessData = JSON.parse(dataStr);
        patientId = accessData?.patientId || accessData?.patient?.patientId;
      } catch (err) {}
    }

    if (!patientId) {
      setToastMessage({ message: "Patient session not found. Please re-authenticate.", type: "error" });
      return;
    }

    // Create CV with the title and pass the current locale for localization
    const success = await createCv(title, patientId, locale);
    
    if (success) {
      setShowSuccess(true);
    } else {
      // Use the global error from the store if available, otherwise a generic error
      setToastMessage({ message: usePatientMedicalCvsStore.getState().error || "Failed to generate CV. Please try again.", type: "error" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-12 animate-in fade-in duration-300 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>



      {showSuccess ? (
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 lg:p-16 text-center shadow-sm animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
            {t('doctor.medicalCvs.approved')}
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10">
            {title}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setShowSuccess(false);
                setTitle("");
              }}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition"
            >
              {t('doctor.medicalCvs.generateNew')}
            </button>
            <Link
              href={`/doctor/patients/workspace/${code}/medical-cv`}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition"
            >
              {t('doctor.medicalCvs.title')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Massive Hero Section */}
          <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
            {/* Background Graphic */}
            <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12">
              <HugeiconsIcon icon={FileAddIcon} className="w-[500px] h-[500px]" />
            </div>
            
            {/* Back Navigation */}
            <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md cursor-pointer border-none"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('doctor.workspace.breadcrumbPatients')}
              </button>
            </div>
            
            <div className="relative z-10 mt-24">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
                {t('doctor.medicalCvs.generateNew')}
              </h1>
              <p className="text-white/80 text-xl font-medium max-w-2xl">
                {t('doctor.medicalCvs.generateDesc')}
              </p>
            </div>
          </div>
    
          <div className="bg-white border-0 rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-8">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title Field */}
            <div className="space-y-4">
              <label htmlFor="cv-title" className="block text-xl font-bold text-slate-900">
                {t('doctor.medicalCvs.titleLabel')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="cv-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('doctor.medicalCvs.titlePlaceholder')}
                iconLeft={<HugeiconsIcon icon={TextIcon} className="w-6 h-6 text-slate-400" />}
                className="font-bold text-lg h-16 rounded-[20px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isCreating}
                className="relative overflow-hidden group rounded-full px-12 py-5 text-lg font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/40 transition-all duration-300 border-none bg-primary hover:bg-primary/90 text-white"
              >
                <span className={`transition-opacity duration-300 ${isCreating ? "opacity-0" : "opacity-100"}`}>
                  {t('doctor.medicalCvs.generateCv')}
                </span>
                
                {isCreating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-700">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="ml-2 rtl:ml-0 rtl:mr-2">{t('doctor.medicalCvs.generating')}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
        </>
      )}
    </div>
  );
}
