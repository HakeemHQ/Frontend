"use client";

import React, { useState } from "react";
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

export default function AddDocumentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const uploadMethods = [
    {
      id: "photo",
      title: "Take a photo",
      description: "Use your device camera to scan a physical document.",
      icon: Camera01Icon,
    },
    {
      id: "library",
      title: "Choose from library",
      description: "Select an image from your device's photo gallery.",
      icon: Image01Icon,
    },
    {
      id: "files",
      title: "Browse files",
      description: "Select PDF, DOCX, or other files from your device.",
      icon: Folder01Icon,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 animate-in fade-in duration-300">
      
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {uploadMethods.map((method) => (
            <div 
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex flex-col items-center text-center p-8 rounded-xl border-2 transition cursor-pointer ${
                selectedMethod === method.id
                  ? "border-primary-600 bg-primary-50/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-primary-50 text-slate-700 flex items-center justify-center mb-6">
                <HugeiconsIcon icon={method.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-3">{method.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {method.description}
              </p>
            </div>
          ))}
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
              iconLeft={<HugeiconsIcon icon={AiLockIcon} className="w-5 h-5 text-slate-400" />}
              className="bg-white border-slate-200"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Document Date</label>
            <Input 
              placeholder="mm/dd/yyyy"
              iconLeft={<HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-slate-400" />}
              className="bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 font-semibold px-8"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 flex items-center justify-center gap-2"
          >
            Upload Document
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
