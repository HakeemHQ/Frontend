"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";

const PatientsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

import { useLanguage } from "@/localization/LanguageContext";

export function DoctorSidebar() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse, isMobileMenuOpen, closeMobileMenu } = useSidebarStore();

  const navItems = [
    { label: t('nav.patients'), href: "/doctor/patients", icon: <PatientsIcon /> },
    { label: t('doctor.requestAccess.title') || 'Request Access', href: "/doctor/request-access", icon: <HugeiconsIcon icon={UserAdd01Icon} className="w-[18px] h-[18px]" /> },
    { label: t('nav.myProfile'), href: "/doctor/profile", icon: <ProfileIcon /> },
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
      <aside 
        className={`fixed ltr:left-0 rtl:right-0 top-0 block h-screen ltr:border-r rtl:border-l border-slate-100 bg-white/90 backdrop-blur-xl z-50 transition-all duration-300 shadow-sm ${
          isCollapsed ? "w-[240px] md:w-[72px]" : "w-[240px] md:w-[72px] lg:w-[240px]"
        } ${isMobileMenuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full ltr:md:translate-x-0 rtl:md:translate-x-0"}`}
      >
        <div className="flex h-full flex-col relative">
          {/* Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className={`absolute top-6 hidden md:flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-primary transition-colors z-50 ${
              isRTL ? "-left-2.5" : "-right-2.5"
            }`}
            aria-label={t('nav.toggleSidebar')}
          >
            {isRTL 
              ? (isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />) 
              : (isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />)
            }
          </button>

          <div className={`flex items-center px-5 py-5 border-b border-slate-50 ${isCollapsed ? "justify-start md:justify-center px-5 md:px-0" : "gap-3"}`}>
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
            
            <div className={`overflow-hidden whitespace-nowrap transition-opacity duration-300 ml-2 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>
              <div className="text-base font-bold font-heading tracking-tight text-primary">
                {t('common.appName')}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {t('common.brandTagline')}
              </div>
            </div>
          </div>

          <nav className="mt-4 flex-1 px-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/' && item.href !== '/doctor/patients');
                const isPatientsTab = item.href === "/doctor/patients";
                const isPatientsActive = isPatientsTab && pathname.startsWith('/doctor/patients');
                const finalIsActive = isPatientsActive || isActive;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl py-2.5 font-semibold transition-all duration-200 ${
                      isCollapsed ? "justify-start md:justify-center px-3.5 md:px-0" : "gap-3 px-3.5 text-sm"
                    } ${
                      finalIsActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={finalIsActive ? "text-white shrink-0" : "text-slate-400 shrink-0"}>
                      {item.icon}
                    </span>
                    <span className={`ml-2 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-3 border-t border-slate-50">
            <button 
              onClick={() => { closeMobileMenu(); logout(); }}
              title={isCollapsed ? t('nav.logout') : undefined}
              className={`flex w-full items-center rounded-xl py-2.5 font-semibold text-rose-500 transition-all duration-200 hover:bg-rose-50 cursor-pointer ${
                isCollapsed ? "justify-start md:justify-center px-3.5 md:px-0" : "gap-3 px-3.5 text-sm"
              }`}
            >
              <span className="shrink-0"><LogoutIcon /></span>
              <span className={`ml-2 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
