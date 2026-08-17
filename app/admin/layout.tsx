"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

import { useSidebarStore } from "@/store/useSidebarStore";

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleMobileMenu } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminSidebar />
      <div className="ltr:pl-0 rtl:pr-0 ltr:md:pl-[240px] rtl:md:pr-[240px] flex flex-col min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between md:justify-end px-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
          >
            <HamburgerIcon />
          </button>
          <LanguageSwitcher />
        </header>
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 md:p-8 flex-1 relative overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
