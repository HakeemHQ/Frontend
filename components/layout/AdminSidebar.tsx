"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const DoctorsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LogsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

import { useSidebarStore } from "@/store/useSidebarStore";
import { useLanguage } from "@/localization/LanguageContext";

export function AdminSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useSidebarStore();

  const navItems = [
    { label: t('nav.dashboard'), href: "/admin/dashboard", icon: <DashboardIcon /> },
    { label: t('nav.doctors'), href: "/admin/doctors", icon: <DoctorsIcon /> },
    { label: t('nav.users'), href: "/admin/users", icon: <UsersIcon /> },
    { label: t('nav.auditLogs'), href: "/admin/logs", icon: <LogsIcon /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      <aside className={`fixed ltr:left-0 rtl:right-0 top-0 h-screen w-[240px] ltr:border-r rtl:border-l border-slate-100 bg-white/90 backdrop-blur-xl z-50 shadow-sm transition-transform duration-300 ltr:md:translate-x-0 rtl:md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-50">
            <div className="flex h-9 w-9 items-center justify-center shrink-0 overflow-hidden rounded-lg">
              <Image 
                src="/icon.png" 
                alt="Hakeem Logo" 
                width={36} 
                height={36} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div>
              <div className="text-base font-bold font-heading tracking-tight text-primary">
                Hakeem
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Premium Medical SaaS
              </div>
            </div>
          </div>

          <nav className="mt-4 flex-1 px-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-3 border-t border-slate-50">
            <button 
              onClick={() => { closeMobileMenu(); logout(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-500 transition-all duration-200 hover:bg-rose-50 cursor-pointer"
            >
              <LogoutIcon />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
