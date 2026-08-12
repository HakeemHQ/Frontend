"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  DocumentAttachmentIcon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  Chemistry01Icon,
  AiMagicIcon,
  UserIcon,
  Delete01Icon,
  Checkmark,
  Edit01Icon
} from "@hugeicons/core-free-icons";

export default function ReviewDataPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 shrink-0 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">Review Extracted Data</h1>
          <p className="text-slate-600 mb-3">HbA1c Lab Panel • Al-Habib Medical Lab</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-600">
            <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-3.5 h-3.5" />
            Lab_Report_HbA1c_Jan2025.pdf
          </div>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-primary-100 text-primary-800 border border-primary-200 rounded-full text-sm font-semibold">
          8 Total
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-semibold">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4" />
          5 Approved
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-300 rounded-full text-sm font-semibold">
          <HugeiconsIcon icon={Alert01Icon} className="w-4 h-4" />
          3 Need Review
        </div>
      </div>

      {/* Result Cards List */}
      <div className="space-y-6">
        
        {/* Approved Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Chemistry01Icon} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Result</span>
                <span className="px-2 py-1 bg-[#A7F3D0] text-[#065f46] text-xs font-bold rounded-md">
                  Approved
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-4">Hemoglobin A1c</h3>
              
              <div className="flex items-center gap-8">
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Dosage</span>
                  <span className="font-semibold text-slate-900">500 mg</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Repetition</span>
                  <span className="font-semibold text-slate-900">twice a day</span>
                </div>
                <div className="ml-4 flex items-center gap-1.5 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md text-xs font-bold">
                  <HugeiconsIcon icon={AiMagicIcon} className="w-3.5 h-3.5" />
                  99% Confidence
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required Card */}
        <div className="bg-white border border-primary-200 border-l-4 border-l-red-500 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-6 h-6 rotate-180" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-red-500 uppercase tracking-wider">Action Required</span>
                <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-md">
                  Low Confidence (45%)
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <Input 
                    placeholder="Your first name" 
                    iconLeft={<HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-slate-400" />}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <Input 
                    placeholder="Your first name" 
                    iconLeft={<HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-slate-400" />}
                    className="bg-white"
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm">
                  Twice daily with meals
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 px-6 flex items-center gap-2">
                  <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                  Reject
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 flex items-center gap-2">
                  <HugeiconsIcon icon={Checkmark} className="w-4 h-4" />
                  Approve & Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Unapproved Needs Review Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Result</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-4">Hemoglobin A1c</h3>
              
              <div className="flex items-center gap-8 mb-6">
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Repetition</span>
                  <span className="font-semibold text-slate-900">twice a day</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Dosage</span>
                  <span className="font-semibold text-slate-900">500 mg</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md text-xs font-bold">
                  <HugeiconsIcon icon={AiMagicIcon} className="w-3.5 h-3.5" />
                  92% Confidence
                </div>
                
                <div className="flex items-center gap-2">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white flex-1 sm:flex-none flex items-center justify-center gap-2">
                    <HugeiconsIcon icon={Checkmark} className="w-4 h-4" />
                    Approve & Save
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 px-4">
                    <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 px-4">
                    <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
