"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";



const PatientsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);


import { useSidebarStore } from "@/store/useSidebarStore";

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

import { useLanguage } from "@/localization/LanguageContext";

export function DoctorSidebar() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  const params = useParams();
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse, isMobileMenuOpen, closeMobileMenu } = useSidebarStore();
  
  const code = params?.code as string | undefined;

  const navItems = [
    { label: t('nav.patients'), href: "/doctor/patients", icon: <PatientsIcon /> },
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
        className={`fixed ltr:left-0 rtl:right-0 top-0 block h-screen ltr:border-r-2 rtl:border-l-2 border-slate-100 bg-white/80 backdrop-blur-2xl z-50 transition-all duration-300 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] ${
          isCollapsed ? "w-[260px] md:w-[80px]" : "w-[260px] md:w-[80px] lg:w-[260px]"
        } ${isMobileMenuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full ltr:md:translate-x-0 rtl:md:translate-x-0"}`}
      >
        <div className="flex h-full flex-col relative">
          {/* Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className={`absolute top-10 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-primary transition-colors z-50 ${
              isRTL ? "-left-3" : "-right-3"
            }`}
            aria-label={t('nav.toggleSidebar')}
          >
            {isRTL 
              ? (isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />) 
              : (isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />)
            }
          </button>

          <div className={`flex items-center px-6 py-8 ${isCollapsed ? "justify-start md:justify-center px-6 md:px-0" : "gap-3"}`}>
            <div className="flex h-10 w-10 items-center justify-center shrink-0 overflow-hidden rounded-xl">
              <Image 
                src="/icon.png" 
                alt="Hakeem Logo" 
                width={40} 
                height={40} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
            
            <div className={`overflow-hidden whitespace-nowrap transition-opacity duration-300 ml-3 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>
              <div className="text-lg font-bold font-heading tracking-tight text-primary">
                {t('common.appName')}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {t('common.brandTagline')}
              </div>
            </div>
          </div>

        <nav className="mt-4 flex-1 px-4">
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
                  className={`flex items-center rounded-[24px] py-4 font-bold transition-all duration-300 ${
                    isCollapsed ? "justify-start md:justify-center px-6 md:px-0 mx-2" : "gap-3 px-6 text-[15px]"
                  } ${
                    finalIsActive
                      ? "bg-primary text-white shadow-xl shadow-primary/30 -translate-y-1 mx-2"
                      : "text-slate-500 hover:bg-white hover:shadow-md hover:text-slate-900 mx-2"
                  }`}
                >
                  <span className={finalIsActive ? "text-white shrink-0" : "text-slate-400 shrink-0"}>
                    {item.icon}
                  </span>
                  <span className={`ml-3 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-4 py-6">
          <button 
            onClick={() => { closeMobileMenu(); logout(); }}
            title={isCollapsed ? t('nav.logout') : undefined}
            className={`flex w-full items-center rounded-[20px] py-4 font-bold text-rose-500 transition-all hover:bg-rose-50 hover:shadow-sm cursor-pointer mx-2 ${
              isCollapsed ? "justify-start md:justify-center px-6 md:px-0 w-auto" : "gap-3 px-6 text-[15px] w-auto"
            }`}
          >
            <span className="shrink-0"><LogoutIcon /></span>
            <span className={`ml-3 md:ml-0 ${isCollapsed ? "block md:hidden" : "block md:hidden lg:block"}`}>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
