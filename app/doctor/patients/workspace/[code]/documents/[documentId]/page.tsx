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
  Tick02Icon,
  DocumentValidationIcon
} from "@hugeicons/core-free-icons";
import { getDocumentContent, getDocumentMedicalRecords, detectDocumentMimeType, GetMedicalRecordsResponse } from "@/lib/api/documents";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
// removed DocumentExtractedData

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
  const [medicalRecords, setMedicalRecords] = useState<GetMedicalRecordsResponse | null>(null);
  const [isExtracting, setIsExtracting] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  // Find document title from store
  const documentInfo = documents.find(d => d.documentId === documentId);
  const documentName = documentInfo?.title || t('doctor.documents.breadcrumbPreview');

  useEffect(() => {
    let url: string | null = null;
    
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const rawBlob = await getDocumentContent(documentId);
        const { mimeType, blob } = await detectDocumentMimeType(rawBlob, documentName);
        
        setFileType(mimeType);
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error("Failed to load document content", err);
        setError("Failed to load document content. It may have been deleted or is inaccessible.");
      } finally {
        setIsLoading(false);
      }
    };

    if (documentId) {
      fetchContent();
    }
    
    // Cleanup URL object to avoid memory leaks
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [documentId, documentName]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setIsExtracting(true);
        const res = await getDocumentMedicalRecords(documentId, { pageNumber, pageSize });
        
        // Handle ApiResponse wrapper or raw data
        const data = ('success' in res && 'data' in res) ? res.data : res;
        setMedicalRecords(data as unknown as GetMedicalRecordsResponse);
      } catch (err) {
        console.error("Failed to load medical records", err);
      } finally {
        setIsExtracting(false);
      }
    };

    if (documentId) {
      fetchMedicalRecords();
    }
  }, [documentId, pageNumber]);

  const parseRecordData = (displayName: string) => {
    if (!displayName) return { title: 'Record', primaryValue: null, details: [] };
    
    const pairs = displayName.split(',').map(pair => {
      const [key, ...valueParts] = pair.split(':');
      return {
        key: key?.trim(),
        value: valueParts.join(':')?.trim()
      };
    }).filter(item => item.key && item.value);

    // Try to find a title field
    const titleKeys = ['LabTestName', 'DrugName', 'ObservationName', 'Name', 'TestName', 'DocumentType'];
    let titleItem = pairs.find(p => titleKeys.includes(p.key));
    
    // Try to find a primary value
    const valueKeys = ['LabValue', 'Value', 'Result', 'Dosage'];
    let valueItem = pairs.find(p => valueKeys.includes(p.key));

    // Remove title and value from details
    const details = pairs.filter(p => p !== titleItem && p !== valueItem);

    return {
      title: titleItem ? titleItem.value : 'Medical Record',
      primaryValue: valueItem ? valueItem.value : null,
      primaryValueKey: valueItem ? valueItem.key : null,
      details
    };
  };

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

      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px]">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={DocumentValidationIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation & Actions */}
        <div className="absolute top-10 left-10 right-10 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link 
            href={`/doctor/patients/workspace/${code}/documents`}
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.documents.title')}
          </Link>
          <button 
            className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDownload}
            disabled={!blobUrl || isLoading}
          >
            <HugeiconsIcon icon={Download01Icon} className="w-5 h-5" />
            {t('doctor.documents.download')}
          </button>
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {documentName}
          </h1>
        </div>
      </div>

      <div className="w-full border-0 rounded-[40px] bg-white shadow-2xl shadow-slate-200/50 p-4 md:p-8 flex flex-col min-h-[800px] relative z-30 -mt-20 mx-4 md:mx-auto md:w-auto">

        {/* Document Viewer Area */}
        <div className="flex-1 border border-slate-100 rounded-[32px] overflow-hidden bg-slate-50 flex items-center justify-center relative shadow-inner">
          
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

      {isExtracting ? (
        <div className="w-full border-0 rounded-[40px] bg-white shadow-xl shadow-slate-200/50 overflow-hidden p-12 flex flex-col items-center justify-center min-h-[300px] mt-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="font-bold text-lg text-slate-500">{t('doctor.documents.processing')}</p>
        </div>
      ) : medicalRecords && medicalRecords.items && medicalRecords.items.length > 0 ? (
        <div className="w-full border-0 rounded-[40px] bg-white shadow-xl shadow-slate-200/50 overflow-hidden mt-8">
          <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight mb-2">Medical Records</h2>
              <p className="text-base font-medium text-slate-500">Medical records extracted from this document</p>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalRecords.items.map((record) => {
                const { title, primaryValue, details } = parseRecordData(record.displayName);
                const unitItem = details.find(d => d.key.toLowerCase() === 'unit');
                const filteredDetails = details.filter(d => d.key.toLowerCase() !== 'unit');
                
                return (
                <div key={record.medicalRecordId} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-md shadow-slate-200/40 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left rtl:text-right">
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {record.recordType}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                      record.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <h4 className="font-black text-slate-900 text-xl mb-1 leading-tight">{title}</h4>
                    {primaryValue && (
                       <div className="flex items-baseline gap-1.5 mt-3">
                         <span className="text-4xl font-black text-primary tracking-tighter">{primaryValue}</span>
                         {unitItem && (
                           <span className="text-sm font-bold text-slate-400">
                             {unitItem.value}
                           </span>
                         )}
                       </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1">
                    {filteredDetails.length > 0 ? filteredDetails.map((item, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{item.key}</span>
                        <span className="text-slate-800 text-sm font-semibold block leading-snug">{item.value}</span>
                      </div>
                    )) : (
                      <div className="flex items-center justify-center h-full opacity-50">
                        <span className="text-xs text-slate-400 italic">No additional details</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                      {new Date(record.clinicalDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )})}
            </div>

            {medicalRecords.totalCount > pageSize && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  {t('common.showing') || 'Showing'} <span className="font-bold text-slate-900">{(pageNumber - 1) * pageSize + 1}</span> {t('common.to') || 'to'} <span className="font-bold text-slate-900">{Math.min(pageNumber * pageSize, medicalRecords.totalCount)}</span> {t('common.of') || 'of'} <span className="font-bold text-slate-900">{medicalRecords.totalCount}</span>
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                    disabled={pageNumber === 1 || isExtracting}
                  >
                    {t('common.previous') || 'Previous'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPageNumber(prev => prev + 1)}
                    disabled={pageNumber * pageSize >= medicalRecords.totalCount || isExtracting}
                  >
                    {t('common.next') || 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : medicalRecords ? (
        <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px] mt-6">
          <p className="font-medium text-slate-500">{t('doctor.documents.noResultsDesc') || 'No records found.'}</p>
        </div>
      ) : null}

    </div>
  );
}
