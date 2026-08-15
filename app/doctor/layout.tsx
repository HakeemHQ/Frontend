import React from "react";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 selection:bg-emerald-500/30">
      <DoctorSidebar />
      <div className="md:pl-[260px] flex flex-col min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end px-6 sm:px-8 bg-white/80 backdrop-blur border-b border-slate-100">
          <LanguageSwitcher />
        </header>
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 md:p-8 lg:p-12 flex-1">{children}</main>
      </div>
    </div>
  );
}
