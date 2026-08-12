"use client";

import { use, useState } from "react";
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

export default function ReviewDataPage({ params }: { params: Promise<{ code: string, type: string }> }) {
  const router = useRouter();
  const { code, type } = use(params);

  const [statuses, setStatuses] = useState({
    card2: 'pending',
    card3: 'pending'
  });

  const allReviewed = statuses.card2 !== 'pending' && statuses.card3 !== 'pending';

  const handleConfirm = () => {
    if (allReviewed) {
      router.push(`/doctor/patients/workspace/${code}/documents/upload/${type}/confirm`);
    }
  };

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
      <div className="flex flex-wrap items-center gap-3">
        <div className="px-4 py-2 bg-primary-100 text-primary-800 border border-primary-200 rounded-full text-sm font-semibold">
          8 Total
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-semibold">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4" />
          {5 + (statuses.card2 === 'approved' ? 1 : 0) + (statuses.card3 === 'approved' ? 1 : 0)} Approved
        </div>
        {(statuses.card2 === 'pending' || statuses.card3 === 'pending') && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-300 rounded-full text-sm font-semibold">
            <HugeiconsIcon icon={Alert01Icon} className="w-4 h-4" />
            {(statuses.card2 === 'pending' ? 1 : 0) + (statuses.card3 === 'pending' ? 1 : 0)} Need Review
          </div>
        )}
        {(statuses.card2 === 'rejected' || statuses.card3 === 'rejected') && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-sm font-semibold">
            <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
            {(statuses.card2 === 'rejected' ? 1 : 0) + (statuses.card3 === 'rejected' ? 1 : 0)} Rejected
          </div>
        )}
      </div>

      {/* Result Cards List */}
      <div className="space-y-6">
        
        {/* Approved Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
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
              
              <div className="flex flex-wrap items-center gap-8">
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Dosage</span>
                  <span className="font-semibold text-slate-900">500 mg</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Repetition</span>
                  <span className="font-semibold text-slate-900">twice a day</span>
                </div>
                <div className="sm:ml-4 flex items-center gap-1.5 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md text-xs font-bold">
                  <HugeiconsIcon icon={AiMagicIcon} className="w-3.5 h-3.5" />
                  99% Confidence
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required Card */}
        <div className={`bg-white border ${statuses.card2 === 'pending' ? 'border-primary-200 border-l-4 border-l-red-500' : 'border-slate-200 opacity-60 hover:opacity-100 transition-opacity'} rounded-xl p-6 shadow-sm relative overflow-hidden`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${statuses.card2 === 'pending' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'} flex items-center justify-center shrink-0`}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-6 h-6 rotate-180" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-sm font-bold uppercase tracking-wider ${statuses.card2 === 'pending' ? 'text-red-500' : 'text-slate-500'}`}>
                  {statuses.card2 === 'pending' ? 'Action Required' : 'Action Resolved'}
                </span>
                {statuses.card2 === 'pending' ? (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-md">
                    Low Confidence (45%)
                  </span>
                ) : statuses.card2 === 'approved' ? (
                  <span className="px-2 py-1 bg-[#A7F3D0] text-[#065f46] text-xs font-bold rounded-md">
                    Approved
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                    Rejected
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <Input 
                    placeholder="Your first name" 
                    iconLeft={<HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-slate-400" />}
                    className="bg-white"
                    disabled={statuses.card2 !== 'pending'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <Input 
                    placeholder="Your first name" 
                    iconLeft={<HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-slate-400" />}
                    className="bg-white"
                    disabled={statuses.card2 !== 'pending'}
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
                <div className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm ${statuses.card2 !== 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Twice daily with meals
                </div>
              </div>

              {statuses.card2 === 'pending' && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    onClick={() => setStatuses(prev => ({ ...prev, card2: 'rejected' }))}
                    className="border-red-500 text-red-600 hover:bg-red-50 px-6 flex items-center gap-2"
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => setStatuses(prev => ({ ...prev, card2: 'approved' }))}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 flex items-center gap-2"
                  >
                    <HugeiconsIcon icon={Checkmark} className="w-4 h-4" />
                    Approve & Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unapproved Needs Review Card */}
        <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm ${statuses.card3 !== 'pending' ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${statuses.card3 !== 'pending' ? 'bg-slate-50 text-slate-500' : 'bg-primary-50 text-primary-600'} flex items-center justify-center shrink-0`}>
              <HugeiconsIcon icon={DocumentAttachmentIcon} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Result</span>
                {statuses.card3 === 'approved' && (
                  <span className="px-2 py-1 bg-[#A7F3D0] text-[#065f46] text-xs font-bold rounded-md">
                    Approved
                  </span>
                )}
                {statuses.card3 === 'rejected' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                    Rejected
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-4">Hemoglobin A1c</h3>
              
              <div className="flex flex-wrap items-center gap-8 mb-6">
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Repetition</span>
                  <span className={`font-semibold ${statuses.card3 !== 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>twice a day</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 mb-1">Dosage</span>
                  <span className={`font-semibold ${statuses.card3 !== 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>500 mg</span>
                </div>
              </div>
              
              {statuses.card3 === 'pending' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md text-xs font-bold w-max">
                    <HugeiconsIcon icon={AiMagicIcon} className="w-3.5 h-3.5" />
                    92% Confidence
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setStatuses(prev => ({ ...prev, card3: 'approved' }))}
                      className="bg-primary-600 hover:bg-primary-700 text-white flex-1 sm:flex-none flex items-center justify-center gap-2"
                    >
                      <HugeiconsIcon icon={Checkmark} className="w-4 h-4" />
                      Approve & Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setStatuses(prev => ({ ...prev, card3: 'rejected' }))}
                      className="border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 px-4"
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 px-4"
                    >
                      <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Confirm Button */}
      <div className="flex justify-end pt-8 border-t border-slate-200">
        <Button 
          disabled={!allReviewed} 
          onClick={handleConfirm}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-2.5 text-base font-semibold shadow-sm"
        >
          {allReviewed ? 'Confirm Review' : 'Review Remaining Items'}
        </Button>
      </div>

    </div>
  );
}
