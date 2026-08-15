import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminSidebar />
      <div className="md:pl-[260px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end px-6 sm:px-8 bg-white/80 backdrop-blur border-b border-slate-100">
          <LanguageSwitcher />
        </header>
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
