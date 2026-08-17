"use client";

import React from "react";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useSidebarStore } from "@/store/useSidebarStore";

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, toggleMobileMenu } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 selection:bg-emerald-500/30">
      <DoctorSidebar />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ltr:pl-0 rtl:pr-0 ${isCollapsed ? "ltr:md:pl-[72px] rtl:md:pr-[72px]" : "ltr:md:pl-[72px] rtl:md:pr-[72px] ltr:lg:pl-[240px] rtl:lg:pr-[240px]"}`}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between md:justify-end px-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
          >
            <HamburgerIcon />
          </button>
          <LanguageSwitcher />
        </header>
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 md:p-8 lg:p-12 flex-1 relative overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
