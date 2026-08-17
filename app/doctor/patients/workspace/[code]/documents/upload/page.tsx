"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  Image01Icon,
  Folder01Icon,
  Calendar01Icon,
  AiLockIcon,
  ArrowRight01Icon,
  DocumentAttachmentIcon,
  ArrowLeft01Icon
} from "@hugeicons/core-free-icons";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/localization/LanguageContext";

export default function AddDocumentPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { code } = use(params);
  
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ id: string; file: File } | null>(null);
  const [title, setTitle] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const { uploadDocument, isLoading, error, clearError } = usePatientDocumentsStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      setToastMessage({ message: error, type: 'error' });
    }
    return () => {
      clearError();
    };
  }, [error, clearError]);

  const uploadMethods = [
    {
      id: "images",
      title: t('doctor.documents.chooseFile'),
      description: t('doctor.documents.fileLimit'),
      icon: Image01Icon,
      accept: "image/*"
    },
    {
      id: "pdfs",
      title: "PDF",
      description: t('doctor.documents.fileLimit'),
      icon: Folder01Icon,
      accept: "application/pdf"
    },
  ];

  const handleCardClick = (method: any) => {
    setSelectedMethod(method.id);
    if (fileInputRef.current) {
      fileInputRef.current.accept = method.accept;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedMethod) {
      setSelectedFile({ id: selectedMethod, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setToastMessage({ message: t('doctor.documents.chooseFile'), type: "error" });
      return;
    }
    if (!title.trim()) {
      setToastMessage({ message: t('doctor.documents.documentTitlePlaceholder'), type: "error" });
      return;
    }
    if (!documentDate) {
      setToastMessage({ message: t('doctor.documents.date'), type: "error" });
      return;
    }

    const dataStr = sessionStorage.getItem(`access_${code}`);
    let patientId = "";
    if (dataStr) {
      try {
        const accessData = JSON.parse(dataStr);
        patientId = accessData?.patientId || accessData?.patient?.patientId;
      } catch (e) {}
    }

    if (!patientId) {
      setToastMessage({ message: "Could not find Patient ID.", type: "error" });
      return;
    }

    const document = await uploadDocument(patientId, {
      file: selectedFile.file,
      title,
      documentDate
    });

    if (document && document.documentId) {
      router.push(`/doctor/patients/workspace/${code}/documents/${document.documentId}/processing`);
    } else if (document) {
      router.push(`/doctor/patients/workspace/${code}/documents`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 animate-in fade-in duration-300 relative">
      
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Massive Hero Section */}
      <div className="mb-12 bg-primary rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-2xl shadow-primary/40 relative overflow-hidden text-white flex flex-col justify-end min-h-[350px] mx-4 md:mx-auto max-w-5xl">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-10 opacity-10 text-white transform rotate-12 pointer-events-none">
          <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-[500px] h-[500px]" />
        </div>
        
        {/* Back Navigation */}
        <div className="absolute top-10 left-10 z-20 rtl:left-auto rtl:right-10">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md cursor-pointer border-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 rtl:rotate-180 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('doctor.documents.title')}
          </button>
        </div>
        
        <div className="relative z-10 mt-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-heading tracking-tighter mb-4 leading-tight">
            {t('doctor.documents.uploadTitle')}
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl">
            {t('doctor.documents.uploadSubtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative z-30 -mt-20 mx-4 md:mx-auto max-w-4xl border-0">

        {/* Upload Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {uploadMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const hasFile = selectedFile?.id === method.id;
            
            return (
              <div 
                key={method.id}
                onClick={() => handleCardClick(method)}
                className={`flex flex-col items-center justify-center text-center p-10 rounded-[32px] transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-4 border-primary bg-primary/5 scale-105 shadow-xl shadow-primary/20"
                    : "border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50"
                }`}
              >
                <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mb-6 transition-colors duration-300 ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary shadow-sm'}`}>
                  <HugeiconsIcon icon={method.icon} className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-heading mb-3 tracking-tight">{method.title}</h3>
                <p className={`text-base font-bold leading-relaxed ${hasFile ? "text-primary truncate w-full max-w-[250px]" : "text-slate-500"}`}>
                  {hasFile ? selectedFile.file.name : method.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            {t('doctor.documents.document')}
          </span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Form Fields */}
        <div className="space-y-8 max-w-3xl mx-auto mb-16">
          <div className="space-y-4">
            <label className="block text-xl font-bold text-slate-900">
              {t('doctor.documents.documentTitle')}
            </label>
            <Input 
              placeholder={t('doctor.documents.documentTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              iconLeft={<HugeiconsIcon icon={AiLockIcon} className="w-6 h-6 text-slate-400" />}
              className="bg-slate-50 border-slate-100 h-16 rounded-[20px] text-lg font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xl font-bold text-slate-900">
              {t('doctor.documents.date')}
            </label>
            <Input 
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              iconLeft={<HugeiconsIcon icon={Calendar01Icon} className="w-6 h-6 text-slate-400" />}
              className="bg-slate-50 border-slate-100 h-16 rounded-[20px] text-lg font-bold"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 border-t border-slate-100 pt-10">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 font-bold px-10 py-5 rounded-full text-lg transition-all"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t('doctor.profile.cancel')}
          </Button>
          <Button 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-12 py-5 rounded-full text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-none"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('doctor.documents.uploading')}
              </>
            ) : (
              <>
                {t('doctor.documents.uploadButton')}
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 rtl:rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
