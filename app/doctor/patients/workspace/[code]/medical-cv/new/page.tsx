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

export default function NewMedicalCVPage({ params }: { params: Promise<{ code: string }> }) {
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

    // Create CV with just the title as requested by the backend for now
    const success = await createCv(title, patientId);
    
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

      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1.5" />
          Back to Workspace
        </button>
      </div>

      {showSuccess ? (
        <div className="bg-white border border-emerald-100 rounded-3xl p-10 md:p-16 text-center shadow-sm animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
            Medical CV Generated Successfully!
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10">
            The Medical CV &quot;{title}&quot; has been created and is now available in the patient&apos;s records.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setShowSuccess(false);
                setTitle("");
              }}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition"
            >
              Create Another
            </button>
            <Link
              href={`/doctor/patients/workspace/${code}/medical-cv`}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition"
            >
              View All CVs
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 bg-slate-50 border-b border-slate-100 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 shadow-sm border border-blue-200 text-blue-600">
              <HugeiconsIcon icon={FileAddIcon} className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-heading tracking-tight mb-2">
                Generate Medical CV
              </h1>
              <p className="text-slate-500 leading-relaxed text-sm max-w-xl">
                Create a structured summary of the patient&apos;s medical history. Name it descriptively to easily find it later.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <label htmlFor="cv-title" className="block text-sm font-bold text-slate-900">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="cv-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cardiology Medical CV or My Diabetes Summary"
                iconLeft={<HugeiconsIcon icon={TextIcon} className="w-5 h-5 text-slate-400" />}
                className="font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                disabled={isCreating}
                className="relative overflow-hidden group"
              >
                <span className={`transition-opacity duration-300 ${isCreating ? "opacity-0" : "opacity-100"}`}>
                  Generate Medical CV
                </span>
                
                {isCreating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-700">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="ml-2">Generating...</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
