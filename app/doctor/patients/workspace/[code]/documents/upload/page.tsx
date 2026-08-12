"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  InformationCircleIcon,
  Chemistry01Icon,
  ScanIcon,
  CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";

const documentTypes = [
  {
    id: "tests",
    title: "Medical Tests",
    description: "Blood work, lab results, pathology reports, and other diagnostic tests.",
    icon: Chemistry01Icon,
  },
  {
    id: "radiation",
    title: "Medical Radiation",
    description: "X-rays, MRIs, CT scans, ultrasounds, and related imaging reports.",
    icon: ScanIcon,
  },
];

export default function UploadDocumentPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);
  const [selectedType, setSelectedType] = useState<string>("tests");

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 animate-in fade-in duration-300">
      
      {/* Back Button */}
      <div className="mb-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1.5" />
          Back
        </button>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-heading mb-3">Upload Document</h1>
          <p className="text-slate-500 text-lg">
            Select a document type so Hakeem knows what to extract.
          </p>
        </div>

        {/* Encryption Banner */}
        <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
          <HugeiconsIcon icon={InformationCircleIcon} className="w-6 h-6 text-primary-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 font-heading">End-to-End Encryption</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your medical records are encrypted before leaving your device. Only you and authorized providers can access this data.
            </p>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes.map((type) => {
            const isSelected = selectedType === type.id;
            
            return (
              <div 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`relative flex flex-col items-center text-center p-8 rounded-xl border-2 transition cursor-pointer ${
                  isSelected 
                    ? "border-primary-600 bg-primary-100" 
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {/* Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 text-primary-600 bg-white rounded-full">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} variant="solid" className="w-6 h-6" />
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition ${
                  isSelected ? "bg-white text-primary-600 shadow-sm" : "bg-primary-50 text-primary-600"
                }`}>
                  <HugeiconsIcon icon={type.icon} className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{type.title}</h3>
                <p className={`text-sm leading-relaxed ${isSelected ? "text-slate-700" : "text-slate-500"}`}>
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <Button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-lg font-medium"
            onClick={() => {
              router.push(`/doctor/patients/workspace/${code}/documents/upload/${selectedType}`);
            }}
          >
            Continue
          </Button>
        </div>

      </div>
    </div>
  );
}
