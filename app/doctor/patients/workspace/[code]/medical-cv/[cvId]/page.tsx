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

export default function MedicalCVDetailsPage({ params }: { params: Promise<{ code: string; cvId: string }> }) {
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
      setToastMessage({ message: "Version approved successfully!", type: "success" });
    } else {
      setToastMessage({ message: "Failed to approve version.", type: "error" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'ready':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-blue-100">
            <HugeiconsIcon icon={DocumentValidationIcon} className="w-3.5 h-3.5" />
            Draft
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-red-100">
            <HugeiconsIcon icon={Alert01Icon} className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case 'queued':
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
            <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-slate-200">
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">CV Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn&apos;t load the details for this Medical CV.</p>
        <Link href={`/doctor/patients/workspace/${code}/medical-cv`}>
          <Button variant="outline" className="rounded-xl">Go Back</Button>
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

      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          href={`/doctor/patients/workspace/${code}/medical-cv`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1.5" />
          Back to Medical CVs
        </Link>
      </div>

      <div className="mb-10 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <HugeiconsIcon icon={DocumentValidationIcon} className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 font-heading mb-3 pr-12">
            {cv.title || "Untitled Medical CV"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium">
            <span className="capitalize bg-slate-100 px-3 py-1 rounded-lg">Type: {cv.scopeType}</span>
            {cv.focus && <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100">Focus: {cv.focus}</span>}
            <span>•</span>
            <span>Created: {new Date(cv.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Version History</h2>
        <p className="text-slate-500 text-sm">Review drafts, preview PDFs, and approve versions.</p>
      </div>

      <div className="space-y-4">
        {versions.length > 0 ? (
          versions.map((version, index) => (
            <motion.div
              key={version.medicalCvVersionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                version.status.toLowerCase() === 'draft' ? 'border-blue-200 ring-2 ring-blue-50' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">Version {version.versionNumber}</h3>
                  {getStatusBadge(version.status)}
                </div>
                <div className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Generated on: {new Date(version.createdAt).toLocaleString()}</span>
                  {version.approvedAt && (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
                      Approved on: {new Date(version.approvedAt).toLocaleDateString()}
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
                  {previewingVersionId === version.medicalCvVersionId ? 'Loading...' : 'Preview PDF'}
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
                    {approvingVersionId === version.medicalCvVersionId ? 'Approving...' : 'Approve Draft'}
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
                    {downloadingVersionId === version.medicalCvVersionId ? 'Downloading...' : 'Download'}
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-500">No versions generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
