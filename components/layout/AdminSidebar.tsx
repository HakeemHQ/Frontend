"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const DoctorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LogsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Doctors", href: "/admin/doctors", icon: <DoctorsIcon /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon /> },
  { label: "Audit Logs", href: "/admin/logs", icon: <LogsIcon /> },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] border-r border-slate-100 bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-8 w-8 items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="3" y="2" width="9" height="28" fill="#2563eb" />
              <rect x="12" y="11" width="8" height="10" fill="#2563eb" />
              <path d="M20 2H29V21L20 30V2Z" fill="#2563eb" />
              <path d="M29 21V30H20L29 21Z" fill="#10b981" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-blue-600">
              Hakeem
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Premium Medical SaaS
            </div>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-4 py-6">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
