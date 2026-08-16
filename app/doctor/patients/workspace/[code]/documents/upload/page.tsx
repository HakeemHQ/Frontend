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
  DocumentAttachmentIcon
} from "@hugeicons/core-free-icons";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";

export default function AddDocumentPage({ params }: { params: Promise<{ code: string }> }) {
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
      title: "Upload Image",
      description: "Select an image from your device's photo gallery.",
      icon: Image01Icon,
      accept: "image/*"
    },
    {
      id: "pdfs",
      title: "Upload PDF",
      description: "Select PDF documents from your device.",
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
      setToastMessage({ message: "Please select a file to upload.", type: "error" });
      return;
    }
    if (!title.trim()) {
      setToastMessage({ message: "Please enter a document title.", type: "error" });
      return;
    }
    if (!documentDate) {
      setToastMessage({ message: "Please select a document date.", type: "error" });
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
            <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading mb-3">Add document</h1>
          <p className="text-slate-500 text-lg">Choose how you'd like to add your document.</p>
        </div>

        {/* Upload Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {uploadMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const hasFile = selectedFile?.id === method.id;
            
            return (
              <div 
                key={method.id}
                onClick={() => handleCardClick(method)}
                className={`flex flex-col items-center text-center p-8 rounded-xl border-2 transition cursor-pointer ${
                  isSelected
                    ? "border-primary-600 bg-primary-50/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 text-slate-700 flex items-center justify-center mb-6">
                  <HugeiconsIcon icon={method.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading mb-3">{method.title}</h3>
                <p className={`text-sm leading-relaxed ${hasFile ? "text-primary-600 font-semibold truncate w-full max-w-[200px]" : "text-slate-500"}`}>
                  {hasFile ? selectedFile.file.name : method.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Document Details</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 max-w-2xl mx-auto mb-16">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Document Title</label>
            <Input 
              placeholder="e.g., Blood Test Results - Q1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              iconLeft={<HugeiconsIcon icon={AiLockIcon} className="w-5 h-5 text-slate-400" />}
              className="bg-white border-slate-200"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Document Date</label>
            <Input 
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              iconLeft={<HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-slate-400" />}
              className="bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 font-semibold px-8 disabled:opacity-50"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                Upload Document
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
