import React from "react";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 selection:bg-emerald-500/30">
      <DoctorSidebar />
      <div className="md:pl-[260px] transition-all duration-300">
        <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8 lg:p-12 mt-16 md:mt-0">{children}</main>
      </div>
    </div>
  );
}
