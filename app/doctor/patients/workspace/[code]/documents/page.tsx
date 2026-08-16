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

export default function DocumentsPage({ params }: { params: Promise<{ code: string }> }) {
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
          Reviewed
        </span>
      );
    }

    if (revStatus === 'partiallyreviewed' || revStatus === 'partially_reviewed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
          <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
          Partially Reviewed
        </span>
      );
    }

    if (extStatus === 'processing' || extStatus === 'queued') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-amber-100">
          <HugeiconsIcon icon={Time02Icon} className="w-3.5 h-3.5" />
          {doc.extractionStatus || 'Processing'}
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
          Waiting for Review
        </span>
      );
    }

    if (extStatus === 'uploaded') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
          Uploaded
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

      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-2">
        <Link href={`/doctor/patients/workspace/${code}`} className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-primary-600">Documents</span>
      </div>

      <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Documents</h1>
          <Link href={`/doctor/patients/workspace/${code}/documents/upload`}>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-medium flex items-center gap-2">
              <HugeiconsIcon icon={FileUploadIcon} className="w-4 h-4" />
              Upload Document
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
          <div className="w-full sm:w-1/2 md:w-2/5">
            <Input
              placeholder="Search documents by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="w-5 h-5 text-slate-400" />}
              className="bg-slate-50 border-slate-200"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-32">
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                <option>All</option>
                <option>Completed</option>
                <option>Processing</option>
              </select>
            </div>
            <button className="h-11 w-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition shrink-0 self-end">
              <HugeiconsIcon icon={FilterIcon} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Document</th>
                <th scope="col" className="px-6 py-4 font-bold">Date</th>
                <th scope="col" className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => {
                  const formattedDate = doc.documentDate ? new Date(doc.documentDate).toLocaleDateString() : 'N/A';
                  return (
                    <tr 
                      key={doc.documentId} 
                      className="bg-white hover:bg-slate-50 transition cursor-pointer"
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
                      <td className="px-6 py-5 font-semibold text-slate-900">{doc.title}</td>
                      <td className="px-6 py-5">{formattedDate}</td>
                      <td className="px-6 py-5">
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
                    <p className="font-medium text-slate-900">No documents found</p>
                    <p className="text-sm mt-1">Try adjusting your search filters or upload a new document.</p>
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
