"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Search01Icon,
  FileUploadIcon,
  FilterIcon,
  CheckmarkCircle02Icon,
  Time02Icon
} from "@hugeicons/core-free-icons";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";

import { useLanguage } from "@/localization/LanguageContext";

export default function DocumentsPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code } = use(params);
  
  const { documents, isLoading, error, fetchDocuments, clearError } = usePatientDocumentsStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const dataStr = sessionStorage.getItem(`access_${code}`);
    if (dataStr) {
      try {
        const accessData = JSON.parse(dataStr);
        const patientId = accessData?.patientId || accessData?.patient?.patientId;
        if (patientId) {
          fetchDocuments(patientId);
        } else {
          setToastMessage({ message: "Could not find Patient ID for this workspace.", type: "error" });
        }
      } catch (e) {
        console.error("Failed to parse access data");
      }
    }
  }, [code, fetchDocuments]);

  useEffect(() => {
    if (error) {
      setToastMessage({ message: error, type: 'error' });
    }
    return () => {
      clearError();
    };
  }, [error, clearError]);

  const filteredDocuments = (Array.isArray(documents) ? documents : []).filter(doc => {
    return doc.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (doc: any) => {
    const extStatus = (doc.extractionStatus || doc.status || '').toLowerCase();
    const revStatus = (doc.reviewStatus || doc.documentReviewStatus || '').toLowerCase();

    if (
      revStatus === 'fullyreviewed' || 
      revStatus === 'fully_reviewed' || 
      revStatus === 'reviewed' || 
      revStatus === 'confirmed' || 
      revStatus === 'approved'
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
          {t('doctor.documents.reviewed')}
        </span>
      );
    }

    if (revStatus === 'partiallyreviewed' || revStatus === 'partially_reviewed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
          <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
          {t('doctor.documents.partiallyReviewed')}
        </span>
      );
    }

    if (extStatus === 'processing' || extStatus === 'queued') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
          <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
          {t('doctor.documents.processing')}
        </span>
      );
    }
    
    if (
      extStatus === 'completed' || 
      extStatus === 'waiting for review' || 
      extStatus === 'waiting_for_review' || 
      revStatus === 'unreviewed' || 
      revStatus === 'waiting for review' || 
      revStatus === 'pending'
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-blue-100">
          <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
          {t('doctor.documents.waitingForReview')}
        </span>
      );
    }

    if (extStatus === 'uploaded') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
          {t('doctor.documents.uploaded')}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide bg-slate-50 text-slate-700 border border-slate-200">
        {doc.reviewStatus || doc.extractionStatus || doc.status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-6 animate-in fade-in duration-300 relative">
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
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12">
          <HugeiconsIcon icon={FileUploadIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation & Actions */}
        <div className="absolute top-10 left-10 right-10 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link 
            href={`/doctor/patients/workspace/${code}`}
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.workspace.breadcrumbPatients')}
          </Link>
          <Link 
            href={`/doctor/patients/workspace/${code}/documents/upload`}
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={FileUploadIcon} className="w-5 h-5" />
            {t('doctor.documents.upload')}
          </Link>
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.documents.title')}
          </h1>
        </div>
      </div>

      <div className="w-full border-0 rounded-[40px] bg-white shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-8 md:w-auto">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-8">
          <div className="w-full sm:w-1/2 md:w-2/5">
            <Input
              placeholder={t('doctor.documents.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="w-6 h-6 text-slate-400" />}
              className="bg-slate-50 border-slate-200 h-16 rounded-[20px] text-lg font-bold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[24px] border border-slate-100 shadow-sm">
          <table className="w-full text-base text-left rtl:text-right text-slate-600">
            <thead className="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-100 font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-8 py-6">{t('doctor.documents.document')}</th>
                <th scope="col" className="px-8 py-6">{t('doctor.documents.date')}</th>
                <th scope="col" className="px-8 py-6">{t('doctor.documents.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    {t('doctor.documents.loadingDocuments')}
                  </td>
                </tr>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => {
                  const formattedDate = doc.documentDate ? new Date(doc.documentDate).toLocaleDateString() : 'N/A';
                  return (
                    <tr 
                      key={`${doc.documentId || 'doc'}-${index}`} 
                      className="bg-white hover:bg-slate-50 transition-colors duration-300 cursor-pointer group"
                      onClick={() => {
                        const revStatus = (doc.reviewStatus || doc.documentReviewStatus || '').toLowerCase();
                        const isReviewed = 
                          revStatus === 'fullyreviewed' || 
                          revStatus === 'fully_reviewed' || 
                          revStatus === 'reviewed' || 
                          revStatus === 'confirmed' || 
                          revStatus === 'approved';

                        if (!isReviewed && (doc.extractionStatus?.toLowerCase() === 'completed' || doc.extractionStatus?.toLowerCase() === 'waiting for review' || doc.extractionStatus?.toLowerCase() === 'waiting_for_review' || revStatus === 'partiallyreviewed' || revStatus === 'partially_reviewed')) {
                          router.push(`/doctor/patients/workspace/${code}/documents/${doc.documentId}/review`);
                        } else {
                          router.push(`/doctor/patients/workspace/${code}/documents/${doc.documentId}`);
                        }
                      }}
                    >
                      <td className="px-8 py-6 font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{doc.title}</td>
                      <td className="px-8 py-6 font-medium text-slate-500">{formattedDate}</td>
                      <td className="px-8 py-6">
                        {getStatusBadge(doc)}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HugeiconsIcon icon={Search01Icon} className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900">{t('doctor.documents.noResults')}</p>
                    <p className="text-sm mt-1">{t('doctor.documents.noResultsDesc')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
