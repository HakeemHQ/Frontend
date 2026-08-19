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
  CheckmarkCircle02Icon,
  Time02Icon,
  ArrowRight02Icon
} from "@hugeicons/core-free-icons";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { useLanguage } from "@/localization/LanguageContext";

export default function DocumentsPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code } = use(params);
  
  const { documents, isLoading, error, fetchDocuments, clearError, pageNumber, pageSize, totalCount, setPageNumber } = usePatientDocumentsStore();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);
  
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wide border border-emerald-200">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3" />
          {t('doctor.documents.reviewed')}
        </span>
      );
    }

    if (revStatus === 'partiallyreviewed' || revStatus === 'partially_reviewed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-bold uppercase tracking-wide border border-amber-200">
          <HugeiconsIcon icon={Time02Icon} className="w-3 h-3" />
          {t('doctor.documents.partiallyReviewed')}
        </span>
      );
    }

    if (extStatus === 'processing' || extStatus === 'queued') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-bold uppercase tracking-wide border border-amber-200">
          <HugeiconsIcon icon={Time02Icon} className="w-3 h-3" />
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wide border border-blue-200">
          <HugeiconsIcon icon={Time02Icon} className="w-3 h-3" />
          {t('doctor.documents.waitingForReview')}
        </span>
      );
    }

    if (extStatus === 'uploaded') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wide border border-emerald-200">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3" />
          {t('doctor.documents.uploaded')}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
        {doc.reviewStatus || doc.extractionStatus || doc.status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        {/* Back Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Link 
            href={`/doctor/patients/workspace/${code}`}
            className="inline-flex items-center text-xs font-semibold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg backdrop-blur-md self-start"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {t('doctor.workspace.breadcrumbPatients')}
          </Link>
          <Link 
            href={`/doctor/patients/workspace/${code}/documents/upload`}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-white transition bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-sm hover:shadow gap-1.5 self-start sm:self-auto"
          >
            <HugeiconsIcon icon={FileUploadIcon} className="w-4 h-4" />
            {t('doctor.documents.upload')}
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            {t('doctor.documents.title')}
          </h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full rounded-2xl bg-white shadow-sm border border-slate-100 p-5 sm:p-6">
        {/* Search Bar */}
        <div className="mb-5 max-w-sm">
          <Input
            placeholder={t('doctor.documents.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<HugeiconsIcon icon={Search01Icon} className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left rtl:text-right text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 border-b border-slate-100 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5">{t('doctor.documents.document')}</th>
                <th scope="col" className="px-5 py-3.5">{t('doctor.documents.date')}</th>
                <th scope="col" className="px-5 py-3.5">{t('doctor.documents.status')}</th>
                <th scope="col" className="px-5 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-xs">{t('doctor.documents.loadingDocuments')}</span>
                  </td>
                </tr>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => {
                  const formattedDate = doc.documentDate ? new Date(doc.documentDate).toLocaleDateString() : 'N/A';
                  return (
                    <tr 
                      key={`${doc.documentId || 'doc'}-${index}`} 
                      className="bg-white hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
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
                      <td className="px-5 py-3.5 font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{doc.title}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{formattedDate}</td>
                      <td className="px-5 py-3.5">
                        {getStatusBadge(doc)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-400">
                        <HugeiconsIcon icon={ArrowRight02Icon} className="w-4 h-4 ml-auto inline" />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                      <HugeiconsIcon icon={Search01Icon} className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm text-slate-700">{t('doctor.documents.noResults')}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t('doctor.documents.noResultsDesc')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <p className="text-xs text-slate-500 font-medium">
              {t('common.showing') || 'Showing'} <span className="font-bold text-slate-700">{startItem}</span> {t('common.to') || 'to'} <span className="font-bold text-slate-700">{endItem}</span> {t('common.of') || 'of'} <span className="font-bold text-slate-700">{totalCount}</span>
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber <= 1 || isLoading}
                className="text-xs h-8 px-3"
              >
                {t('common.previous') || 'Previous'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber >= totalPages || isLoading}
                className="text-xs h-8 px-3"
              >
                {t('common.next') || 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
