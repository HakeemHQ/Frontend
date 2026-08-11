import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminSidebar />
      <div className="md:pl-[260px]">
        <main className="mx-auto max-w-7xl p-8">{children}</main>
      </div>
    </div>
  );
}
