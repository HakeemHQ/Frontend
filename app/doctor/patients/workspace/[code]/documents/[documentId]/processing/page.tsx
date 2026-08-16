"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrainIcon, File02Icon } from "@hugeicons/core-free-icons";
import { getDocumentExtractedFields } from "@/lib/api/documents";

export default function DocumentProcessingPage({ params }: { params: Promise<{ code: string, documentId: string }> }) {
  const router = useRouter();
  const { code, documentId } = use(params);
  
  const [dots, setDots] = useState("");

  // Simple loading dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Polling logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await getDocumentExtractedFields(documentId);
        const data = ('success' in res && 'data' in res) ? res.data : res;
        
        const status = (data as any)?.extractionStatus?.toLowerCase();
        
        if (status === "completed" || status === "done" || status === "success" || status === "failed" || (data as any)?.items?.length > 0) {
          // Finished!
          router.push(`/doctor/patients/workspace/${code}/documents/${documentId}/review`);
        } else {
          // Keep polling every 2.5 seconds
          timeoutId = setTimeout(checkStatus, 2500);
        }
      } catch (err) {
        console.error("Failed to fetch processing status, retrying...", err);
        timeoutId = setTimeout(checkStatus, 3000);
      }
    };

    checkStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [documentId, router, code]);

  return (
    <div className="max-w-3xl mx-auto pt-20 pb-12 animate-in fade-in duration-700 relative">
      <div className="w-full flex flex-col items-center justify-center text-center">
        
        {/* Animated Scanner Graphic */}
        <div className="relative w-48 h-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden mb-10 flex items-center justify-center">
          
          <HugeiconsIcon icon={File02Icon} className="w-16 h-16 text-slate-300 absolute" />
          <HugeiconsIcon icon={BrainIcon} className="w-8 h-8 text-primary-500 absolute z-10" />

          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500 shadow-[0_0_15px_3px_rgba(var(--primary-600),0.5)] animate-[scan_2s_ease-in-out_infinite]" />
          
          {/* Overlay to dim parts already "scanned" or just styling */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent opacity-50" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-4">
          AI is analyzing your document
        </h1>
        <p className="text-slate-500 text-lg max-w-md">
          Please wait a moment while our system extracts the medical fields and verifies the information{dots}
        </p>
      </div>

      {/* Global Style for the scan animation if not available in tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}} />
    </div>
  );
}
