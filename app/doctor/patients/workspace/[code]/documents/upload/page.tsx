"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Image01Icon,
  Folder01Icon,
  Calendar01Icon,
  AiLockIcon,
  DocumentAttachmentIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Exchange01Icon
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const { uploadDocument, isLoading, error, clearError } = usePatientDocumentsStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (selectedFile && selectedFile.file.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (error) {
      setToastMessage({ message: t(error), type: 'error' });
    }
    return () => {
      clearError();
    };
  }, [error, clearError, t]);

  const uploadMethods = [
    {
      id: "images",
      title: t('doctor.documents.chooseFile') || "Images",
      description: t('doctor.documents.fileLimit') || "Supports PNG, JPG (Max 10MB)",
      icon: Image01Icon,
      accept: "image/*"
    },
    {
      id: "pdfs",
      title: "PDF Document",
      description: t('doctor.documents.fileLimit') || "Supports PDF (Max 10MB)",
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
    if (documentDate > today) {
      setToastMessage({ 
        message: t('doctor.documents.futureDateError') || "Document date cannot be in the future", 
        type: "error" 
      });
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
    <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 relative space-y-6">
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

      {/* Hero Header */}
      <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-6">
        <div className="mb-4">
          <Link 
            href={`/doctor/patients/workspace/${code}/documents`}
            className="inline-flex items-center text-xs font-semibold text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg backdrop-blur-md"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {t('doctor.documents.title')}
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            {t('doctor.documents.uploadTitle')}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-white/80 font-medium max-w-xl">
            {t('doctor.documents.uploadSubtitle')}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        {/* Upload Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {uploadMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const hasFile = selectedFile?.id === method.id;
            
            return (
              <div 
                key={method.id}
                onClick={() => handleCardClick(method)}
                className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-2 border-primary bg-primary/5 shadow-sm"
                    : "border border-slate-200 bg-slate-50/50 hover:border-primary/40 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}>
                  <HugeiconsIcon icon={hasFile ? CheckmarkCircle02Icon : method.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{method.title}</h3>
                <p className={`text-xs font-medium ${hasFile ? "text-primary font-bold truncate max-w-full" : "text-slate-500"}`}>
                  {hasFile ? selectedFile.file.name : method.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Document Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {(selectedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <button
                  type="button"
                  onClick={handleChangeFile}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-primary transition bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
                  title="Choose another file"
                >
                  <HugeiconsIcon icon={Exchange01Icon} className="w-3 h-3" />
                  <span>Change</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 transition bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 cursor-pointer"
                  title="Remove file"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {previewUrl ? (
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center max-h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previewUrl} 
                  alt="Document Preview" 
                  className="max-h-56 w-auto object-contain rounded"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Folder01Icon} className="w-4 h-4" />
                </div>
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.file.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{selectedFile.file.type || "PDF Document"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 max-w-xl mx-auto mb-8">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {t('doctor.documents.documentTitle')}
            </label>
            <Input 
              placeholder={t('doctor.documents.documentTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              iconLeft={<HugeiconsIcon icon={AiLockIcon} className="w-4 h-4 text-slate-400" />}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {t('doctor.documents.date')}
            </label>
            <Input 
              type="date"
              max={today}
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              iconLeft={<HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Button 
            variant="outline" 
            className="px-4 py-2 text-xs font-semibold"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t('doctor.profile.cancel')}
          </Button>
          <Button 
            className="px-5 py-2 text-xs font-semibold"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('doctor.documents.uploading')}</span>
              </div>
            ) : (
              t('doctor.documents.uploadButton')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
