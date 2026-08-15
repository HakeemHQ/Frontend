"use client";

import React from "react";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 selection:bg-emerald-500/30">
      <DoctorSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? "pl-[80px]" : "pl-[80px] lg:pl-[260px]"}`}>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
