import React from "react";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <DoctorSidebar />
      <div className="md:pl-[260px]">
        <main className="mx-auto max-w-7xl p-8">{children}</main>
      </div>
    </div>
  );
}
