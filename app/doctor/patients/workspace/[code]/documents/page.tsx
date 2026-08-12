"use client";

import React, { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Search01Icon,
  FileUploadIcon,
  FilterIcon
} from "@hugeicons/core-free-icons";

const documentsData = [
  {
    id: 1,
    name: "Cardiology prescription.pdf",
    type: "Prescription",
    date: "10 Aug 2026",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 2,
    name: "ECG Report.pdf",
    type: "Lab Report",
    date: "09 Aug 2026",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    name: "Blood Test Results.pdf",
    type: "Lab Report",
    date: "08 Aug 2026",
    status: "Processing",
    statusColor: "bg-orange-50 text-orange-700",
  },
  {
    id: 4,
    name: "Chest X-Ray.pdf",
    type: "Imaging",
    date: "07 Aug 2026",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700",
  },
];

export default function DocumentsPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);
  
  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-2">
        <Link href={`/doctor/patients/workspace/${code}`} className="flex items-center hover:text-slate-800 transition">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-1" />
          <span>Patients</span>
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-primary-600">Documents</span>
      </div>

      <div className="w-full border border-slate-100 rounded-2xl bg-surface shadow-sm overflow-hidden p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Documents</h1>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white font-medium flex items-center gap-2">
            <HugeiconsIcon icon={FileUploadIcon} className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
          <div className="w-full sm:w-1/2 md:w-2/5">
            <Input
              placeholder="Search documents"
              iconLeft={<HugeiconsIcon icon={Search01Icon} className="w-5 h-5 text-slate-400" />}
              className="bg-slate-50 border-slate-200"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-32">
              <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
              <select className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                <option>All</option>
                <option>Prescription</option>
                <option>Lab Report</option>
                <option>Imaging</option>
              </select>
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                <option>All</option>
                <option>Completed</option>
                <option>Processing</option>
              </select>
            </div>
            <button className="h-11 w-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition shrink-0 self-end">
              <HugeiconsIcon icon={FilterIcon} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Document</th>
                <th scope="col" className="px-6 py-4 font-bold">Type</th>
                <th scope="col" className="px-6 py-4 font-bold">Date</th>
                <th scope="col" className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documentsData.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="bg-white hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => router.push(`/doctor/patients/workspace/${code}/documents/${doc.id}`)}
                >
                  <td className="px-6 py-5 font-semibold text-slate-900">{doc.name}</td>
                  <td className="px-6 py-5">{doc.type}</td>
                  <td className="px-6 py-5">{doc.date}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${doc.statusColor}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
