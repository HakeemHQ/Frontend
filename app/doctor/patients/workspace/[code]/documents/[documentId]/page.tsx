"use client";

import React, { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Download01Icon
} from "@hugeicons/core-free-icons";

export default function DocumentPreviewPage({ params }: { params: Promise<{ code: string, documentId: string }> }) {
  const { code } = use(params);

  // In a real app we would fetch the document details using the documentId
  const documentName = "Cardiology prescription.pdf";

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-2">
        <Link href={`/doctor/patients/workspace/${code}/documents`} className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Documents</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-primary-600">Preview</span>
      </div>

      <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-heading">{documentName}</h1>
          <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
            Download
          </Button>
        </div>

        {/* Document Viewer Mockup */}
        <div className="flex flex-col sm:flex-row border border-slate-100 rounded-xl overflow-hidden bg-white shadow-inner min-h-[600px]">
          {/* Thumbnails Sidebar */}
          <div className="w-full sm:w-24 bg-slate-50 border-r border-slate-100 flex sm:flex-col items-center py-4 px-4 sm:px-0 gap-4 overflow-x-auto sm:overflow-y-auto">
            {/* Active Thumbnail */}
            <div className="w-14 h-16 sm:w-16 sm:h-20 bg-white border-2 border-primary-100 shadow-sm rounded-md flex items-center justify-center shrink-0 cursor-pointer">
              <span className="text-xs font-bold text-slate-700">1</span>
            </div>
            {/* Inactive Thumbnail */}
            <div className="w-14 h-16 sm:w-16 sm:h-20 bg-slate-100/50 border border-transparent rounded-md flex items-center justify-center shrink-0 cursor-pointer hover:bg-white hover:border-slate-200 transition">
              <span className="text-xs font-bold text-slate-400">2</span>
            </div>
          </div>

          {/* Main Document Area */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Header block */}
              <div>
                <div className="h-3 w-48 bg-slate-200 rounded-full mb-3"></div>
                <div className="h-2 w-64 bg-slate-200 rounded-full mb-8"></div>
                <div className="h-0.5 w-full bg-slate-300"></div>
                <div className="h-0.5 w-full bg-slate-300 mt-2 mb-12"></div>
              </div>

              {/* Data block rows */}
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-12">
                    <div className="h-2 w-12 bg-slate-300 rounded-full"></div>
                    <div className="flex gap-4">
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-0.5 w-48 bg-slate-200 my-8"></div>

              {/* More Data block rows */}
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={`bottom-${i}`} className="flex gap-12">
                    <div className="h-2 w-12 bg-slate-300 rounded-full"></div>
                    <div className="flex gap-4">
                      <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-14 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Block */}
            <div className="self-end mt-16 pt-8 flex items-end gap-2">
              <span className="text-xs font-bold text-slate-400">Dr.</span>
              <div className="border-b border-slate-300 w-32 relative">
                <svg className="absolute bottom-1 right-2 w-12 h-8 text-slate-400 opacity-60" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10,40 Q20,10 40,30 T70,20 T90,30" />
                  <path d="M30,45 Q50,0 60,45" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
