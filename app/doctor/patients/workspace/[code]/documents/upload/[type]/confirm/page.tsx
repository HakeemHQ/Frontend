"use client";

import React, { use } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  DocumentAttachmentIcon,
  Calendar01Icon,
  Checkmark,
  Edit01Icon,
} from "@hugeicons/core-free-icons";

export default function ConfirmDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleUpload = () => {
    // Navigate to the processing page by replacing /confirm with /processing
    router.push(pathname.replace('/confirm', '/processing'));
  };

  const handleEdit = () => {
    router.back();
  };

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Column: Document Preview Mockup */}
        <div className="w-full md:w-5/12 bg-[#F5F8FF] p-8 md:p-12 flex flex-col items-center justify-center border-r border-slate-100">
          <div className="w-full max-w-[280px] bg-white rounded-lg shadow-md overflow-hidden relative transition-transform hover:scale-105 cursor-pointer">
            {/* Mock Document Header */}
            <div className="bg-[#78A8BC] p-4 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                <span className="text-[10px] font-bold tracking-widest">APEX MEDICAL</span>
              </div>
              <h4 className="text-sm font-semibold">Patient Health Record / Lab Summary</h4>
            </div>
            
            {/* Mock Document Body */}
            <div className="p-4 space-y-4">
              <div className="flex justify-between text-[8px] text-slate-500 border-b border-slate-100 pb-2">
                <span>PATIENT ID: PM-49323 | DOCTOR: Dr. E. Vance</span>
                <span>REPORT DATE: 22/10/2023</span>
              </div>
              
              <div>
                <h5 className="text-[9px] font-bold text-slate-700 mb-1.5 uppercase">Test Results:</h5>
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="h-1.5 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-1.5 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-1.5 w-24 bg-slate-200 rounded-full"></div>
                    <div className="h-1.5 w-14 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-20 bg-slate-100 rounded-full"></div>
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full"></div>
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
                    <div className="h-1.5 w-18 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h5 className="text-[9px] font-bold text-slate-700 mb-1 uppercase">Diagnosis</h5>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mb-0.5"></div>
                  <div className="h-1.5 w-2/3 bg-slate-200 rounded-full"></div>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold text-slate-700 mb-1 uppercase">Notes</h5>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mb-0.5"></div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mb-0.5"></div>
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Step Overlay */}
            <div className="absolute top-0 inset-x-0 bg-white/90 backdrop-blur-sm border-b border-slate-100 py-1.5 text-center text-[10px] font-medium text-slate-500">
              Step 3 of 4: <span className="font-bold text-slate-700">Confirm Details</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 mt-8">Click to preview document</p>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          
          <div className="flex items-center gap-3 mb-4">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Confirm Details</h1>
          </div>
          
          <p className="text-slate-600 mb-10 text-lg">
            Are you sure you want to proceed with these document details?
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 space-y-6 mb-12">
            <div>
              <span className="block text-sm text-slate-500 mb-1.5">Document Title</span>
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
                <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-5 h-5 text-slate-500" />
                Blood Test Results - Q3
              </div>
            </div>
            
            <div className="h-px w-full bg-slate-200"></div>
            
            <div>
              <span className="block text-sm text-slate-500 mb-1.5">Document Date</span>
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
                <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-slate-500" />
                October 12, 2023
              </div>
            </div>
            
            <div className="h-px w-full bg-slate-200"></div>
            
            <div>
              <span className="block text-sm text-slate-500 mb-2">Category</span>
              <span className="inline-flex px-4 py-1.5 bg-primary-600 text-white text-sm font-semibold rounded-full">
                Laboratory
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg flex items-center justify-center gap-2"
              onClick={handleUpload}
            >
              <HugeiconsIcon icon={Checkmark} className="w-5 h-5" />
              Upload Document
            </Button>
            <Button 
              variant="outline"
              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-6 text-lg flex items-center justify-center gap-2"
              onClick={handleEdit}
            >
              <HugeiconsIcon icon={Edit01Icon} className="w-5 h-5" />
              Edit Document
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
