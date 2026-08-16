"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  File01Icon,
  Delete02Icon,
  Alert02Icon,
  Tick02Icon
} from "@hugeicons/core-free-icons";
import { getDocumentContent, getDocumentExtractedFields } from "@/lib/api/documents";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { DocumentExtractedData } from "@/types/document";

import { useLanguage } from "@/localization/LanguageContext";

export default function DocumentPreviewPage({ params }: { params: Promise<{ code: string; documentId: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code, documentId } = use(params);
  
  const { documents } = usePatientDocumentsStore();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [extractedData, setExtractedData] = useState<DocumentExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(true);

  // Find document title from store
  const documentInfo = documents.find(d => d.documentId === documentId);
  const documentName = documentInfo?.title || t('doctor.documents.breadcrumbPreview');

  useEffect(() => {
    let url: string | null = null;
    
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const blob = await getDocumentContent(documentId);
        
        console.log("Document Content Response:", blob);
        
        // Determine file type from blob
        setFileType(blob.type);
        
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error("Failed to load document content", err);
        setError("Failed to load document content. It may have been deleted or is inaccessible.");
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchExtracted = async () => {
      try {
        setIsExtracting(true);
        const res = await getDocumentExtractedFields(documentId);
        
        // Handle ApiResponse wrapper or raw data
        const data = ('success' in res && 'data' in res) ? res.data : res;
        setExtractedData(data as unknown as DocumentExtractedData);
      } catch (err) {
        console.error("Failed to load extracted data", err);
      } finally {
        setIsExtracting(false);
      }
    };

    if (documentId) {
      fetchContent();
      fetchExtracted();
    }
    
    // Cleanup URL object to avoid memory leaks
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [documentId]);

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      
      // Try to determine extension
      let ext = "";
      if (fileType?.includes("pdf")) ext = ".pdf";
      else if (fileType?.includes("jpeg") || fileType?.includes("jpg")) ext = ".jpg";
      else if (fileType?.includes("png")) ext = ".png";
      
      a.download = `${documentName}${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
        <Link href={`/doctor/patients/workspace/${code}/documents`} className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 rtl:rotate-180 mr-1 rtl:mr-0 rtl:ml-1" />
          <span>{t('doctor.documents.title')}</span>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-primary-600">{t('doctor.documents.breadcrumbPreview')}</span>
      </div>

      <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8 flex flex-col min-h-[800px]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 font-heading">{documentName}</h1>
          <div className="flex items-center gap-3">

            <Button 
              variant="outline" 
              className="border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold flex items-center gap-2 disabled:opacity-50"
              onClick={handleDownload}
              disabled={!blobUrl || isLoading}
            >
              <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
              {t('doctor.documents.download')}
            </Button>
          </div>
        </div>

        {/* Document Viewer Area */}
        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center relative">
          
          {isLoading ? (
            <div className="flex flex-col items-center text-slate-500">
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-medium">{t('doctor.documents.loadingPreview')}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-slate-500 max-w-md text-center p-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <HugeiconsIcon icon={File01Icon} className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-900 mb-2">{t('doctor.documents.previewNotAvailable')}</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : blobUrl ? (
            fileType?.includes("pdf") ? (
              <iframe 
                src={blobUrl} 
                className="w-full h-full min-h-[600px] border-0" 
                title={documentName}
              />
            ) : fileType?.includes("image") ? (
              <div className="w-full h-full min-h-[600px] p-4 flex items-center justify-center overflow-auto bg-slate-100/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={blobUrl} 
                  alt={documentName}
                  className="max-w-full max-h-full object-contain rounded-md shadow-sm border border-slate-200 bg-white"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500 max-w-md text-center p-8">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={File01Icon} className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-900 mb-2">{t('doctor.documents.previewNotAvailable')}</p>
                <Button 
                  onClick={handleDownload}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium mt-4"
                >
                  {t('doctor.documents.download')}
                </Button>
              </div>
            )
          ) : null}

        </div>
      </div>

      {/* Extracted Data Section */}
      {isExtracting ? (
        <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-medium text-slate-500">{t('doctor.documents.processing')}</p>
        </div>
      ) : extractedData && extractedData.items && extractedData.items.length > 0 ? (
        <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden mt-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">{t('doctor.documents.extractedData')}</h2>
              <p className="text-sm text-slate-500">{t('doctor.documents.extractedDataSubtitle')}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            {extractedData.items.map((item, itemIdx) => (
              <div key={item.extractedItemId || itemIdx} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase px-2">
                    {item.itemType} ({t('doctor.documents.item')} {item.sequenceNumber})
                  </span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.fields.map((field, fieldIdx) => {
                    // Determine confidence color
                    let confidenceColor = "bg-green-100 text-green-700";
                    if (field.confidence < 0.5) {
                      confidenceColor = "bg-red-100 text-red-700";
                    } else if (field.confidence < 0.8) {
                      confidenceColor = "bg-amber-100 text-amber-700";
                    }

                    return (
                      <div key={field.extractedFieldId || fieldIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-700 text-sm">{field.fieldName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${confidenceColor}`}>
                            {Math.round(field.confidence * 100)}% {t('doctor.documents.match')}
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium break-words">
                          {field.confirmedValue || field.correctedValue || field.extractedValue || field.originalExtractedValue || <span className="text-slate-400 italic">{t('doctor.documents.notFound')}</span>}
                        </p>
                        
                        {field.issues && field.issues.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-1">
                              {t('doctor.documents.aiFlaggedIssue')}:
                            </p>
                            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                              {field.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : extractedData ? (
        <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px] mt-6">
          <p className="font-medium text-slate-500">{t('doctor.documents.noResultsDesc')}</p>
        </div>
      ) : null}

    </div>
  );
}
