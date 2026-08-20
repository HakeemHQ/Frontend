"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  DocumentValidationIcon,
  CheckmarkCircle02Icon,
  Time02Icon,
  Alert01Icon,
  EyeIcon,
  TickDouble01Icon,
  Download04Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientMedicalCvsStore } from "@/store/usePatientMedicalCvsStore";
import { Toast } from "@/components/ui/Toast";
import { MedicalCvVersionDetail } from "@/types/medical-cv";

import { useLanguage } from "@/localization/LanguageContext";

export default function MedicalCVDetailsPage({ params }: { params: Promise<{ code: string; cvId: string }> }) {
  const { t } = useLanguage();
  const { code, cvId } = use(params);
  const { currentCvDetails, isFetchingDetails, error, fetchCvDetails, fetchVersionPdf, approveVersion } = usePatientMedicalCvsStore();
  
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [approvingVersionId, setApprovingVersionId] = useState<string | null>(null);
  const [previewingVersionId, setPreviewingVersionId] = useState<string | null>(null);
  const [downloadingVersionId, setDownloadingVersionId] = useState<string | null>(null);

  useEffect(() => {
    if (cvId) {
      fetchCvDetails(cvId);
    }
  }, [cvId, fetchCvDetails]);

  useEffect(() => {
    if (error) {
      setToastMessage({ message: error, type: 'error' });
    }
  }, [error]);

  const handlePreview = async (versionId: string) => {
    setPreviewingVersionId(versionId);
    const url = await fetchVersionPdf(versionId);
    setPreviewingVersionId(null);

    if (url) {
      window.open(url, "_blank");
    } else {
      const currentError = usePatientMedicalCvsStore.getState().error;
      setToastMessage({ message: currentError || "Failed to load PDF preview.", type: "error" });
    }
  };

  const handleDownload = async (versionId: string, versionNumber: number) => {
    setDownloadingVersionId(versionId);
    const url = await fetchVersionPdf(versionId);
    setDownloadingVersionId(null);

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `Medical_CV_${code}_v${versionNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const currentError = usePatientMedicalCvsStore.getState().error;
      setToastMessage({ message: currentError || "Failed to download PDF.", type: "error" });
    }
  };

  const handleApprove = async (versionId: string) => {
    setApprovingVersionId(versionId);
    const success = await approveVersion(versionId, cvId);
    setApprovingVersionId(null);

    if (success) {
      setToastMessage({ message: t('doctor.medicalCvs.approved'), type: "success" });
    } else {
      setToastMessage({ message: t('ui.somethingWentWrong'), type: "error" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'ready':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-sm">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4" />
            {t('doctor.medicalCvs.approved')}
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 shadow-sm">
            <HugeiconsIcon icon={DocumentValidationIcon} className="w-4 h-4" />
            {t('doctor.medicalCvs.unreviewed')}
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 shadow-sm">
            <HugeiconsIcon icon={Alert01Icon} className="w-4 h-4" />
            Failed
          </span>
        );
      case 'queued':
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200 shadow-sm">
            <HugeiconsIcon icon={Time02Icon} className="w-4 h-4" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 shadow-sm">
            {status}
          </span>
        );
    }
  };

  if (isFetchingDetails) {
    return (
      <div className="max-w-4xl mx-auto pt-4 pb-12 animate-in fade-in duration-300">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
          <div className="h-12 w-3/4 bg-slate-200 rounded-xl"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
          <div className="mt-8 space-y-4">
            <div className="h-32 w-full bg-slate-100 rounded-2xl"></div>
            <div className="h-32 w-full bg-slate-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCvDetails && !isFetchingDetails) {
    return (
      <div className="max-w-4xl mx-auto pt-4 pb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">{t('doctor.medicalCvs.noResults')}</h2>
        <p className="text-slate-500 mb-6">{t('doctor.medicalCvs.noResultsDesc')}</p>
        <Link href={`/doctor/patients/workspace/${code}/medical-cv`}>
          <Button variant="outline" className="rounded-xl">{t('doctor.medicalCvs.breadcrumbMedicalCv')}</Button>
        </Link>
      </div>
    );
  }

  const cv = currentCvDetails!;
  const versions = [...(cv.versions || [])].sort((a, b) => b.versionNumber - a.versionNumber); // Sort newest first

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 animate-in fade-in duration-300 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Massive Hero Section */}
      <div className="mb-16 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 lg:p-20 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[450px]">
        {/* Background Graphic */}
        <div className="absolute -top-20 -right-20 opacity-10 text-white transform rotate-12">
          <HugeiconsIcon icon={DocumentValidationIcon} className="w-[600px] h-[600px]" />
        </div>
        
        {/* Back Navigation */}
        <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
          <Link 
            href={`/doctor/patients/workspace/${code}/medical-cv`}
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.medicalCvs.breadcrumbMedicalCv')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-20">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl lg:text-8xl font-black font-heading tracking-tighter mb-8 pr-12 rtl:pr-0 rtl:pl-12 leading-[1.1]">
            {cv.title || "Untitled Medical CV"}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg font-bold">
            <span className="capitalize bg-white/20 text-white backdrop-blur-md px-6 py-3 rounded-full shadow-lg">Type: {cv.scopeType}</span>
            {cv.focus && <span className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-full shadow-lg">Focus: {cv.focus}</span>}
            <span className="hidden md:inline text-white/50">•</span>
            <span className="bg-white/10 text-white backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">{t('doctor.documents.date')}: {new Date(cv.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 pl-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tighter mb-4">{t('doctor.medicalCvs.versionHistory')}</h2>
        <p className="text-slate-500 text-lg font-medium">{t('doctor.medicalCvs.description')}</p>
      </div>

      <div className="space-y-4">
        {versions.length > 0 ? (
          versions.map((version, index) => (
            <motion.div
              key={version.medicalCvVersionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border-0 p-8 md:p-12 rounded-[40px] shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-8 transition-all duration-500 hover:-translate-y-2 ${
                version.status.toLowerCase() === 'draft' ? 'shadow-primary/20 ring-4 ring-primary/10 relative z-10 scale-[1.01]' : 'shadow-slate-200/50 hover:shadow-slate-300/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black font-heading text-slate-900 text-3xl md:text-4xl tracking-tighter">{t('doctor.medicalCvs.version')} {version.versionNumber}</h3>
                  {getStatusBadge(version.status)}
                </div>
                <div className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>{new Date(version.createdAt).toLocaleString()}</span>
                  {version.approvedAt && (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
                      {t('doctor.medicalCvs.approved')}: {new Date(version.approvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {/* Preview Button */}
                <Button 
                  variant="outline" 
                  className="rounded-xl flex items-center gap-2"
                  disabled={!version.pdfAvailable || previewingVersionId === version.medicalCvVersionId}
                  onClick={() => handlePreview(version.medicalCvVersionId)}
                >
                  <HugeiconsIcon icon={EyeIcon} className="w-4 h-4" />
                  {previewingVersionId === version.medicalCvVersionId ? 'Loading...' : t('doctor.medicalCvs.previewPdf')}
                </Button>

                {/* Approve Button */}
                {version.status.toLowerCase() === 'draft' && (
                  <Button 
                    variant="primary" 
                    className="rounded-xl flex items-center gap-2 shadow-md shadow-emerald-200"
                    disabled={approvingVersionId === version.medicalCvVersionId}
                    onClick={() => handleApprove(version.medicalCvVersionId)}
                  >
                    <HugeiconsIcon icon={TickDouble01Icon} className="w-4 h-4" />
                    {approvingVersionId === version.medicalCvVersionId ? t('doctor.medicalCvs.approving') : t('doctor.medicalCvs.approveVersion')}
                  </Button>
                )}
                
                {version.status.toLowerCase() === 'approved' && version.pdfAvailable && (
                  <Button 
                    variant="outline" 
                    className="rounded-xl flex items-center gap-2"
                    disabled={downloadingVersionId === version.medicalCvVersionId}
                    onClick={() => handleDownload(version.medicalCvVersionId, version.versionNumber)}
                  >
                    <HugeiconsIcon icon={Download04Icon} className="w-4 h-4" />
                    {downloadingVersionId === version.medicalCvVersionId ? t('doctor.documents.downloading') : t('doctor.medicalCvs.downloadPdf')}
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-500">{t('doctor.medicalCvs.noMedicalCvs')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
