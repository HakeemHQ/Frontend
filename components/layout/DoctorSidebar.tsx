"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";



const PatientsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

const CVsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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

export function DoctorSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  
  const code = params?.code as string | undefined;

  const navItems = [
    { label: "Patients", href: "/doctor/patients", icon: <PatientsIcon /> },
    { label: "All CVs", href: "/doctor/medical-cvs", icon: <CVsIcon /> },
    { label: "My Profile", href: "/doctor/profile", icon: <ProfileIcon /> },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 block h-screen border-r border-slate-100 bg-white z-40 transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[80px] lg:w-[260px]"
      }`}
    >
      <div className="flex h-full flex-col relative">
        {/* Toggle Button */}
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-10 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-blue-600 transition-colors z-50"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>

        <div className={`flex items-center px-6 py-8 ${isCollapsed ? "justify-center px-0" : "gap-3"}`}>
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
          {!isCollapsed && (
            <div className="hidden lg:block overflow-hidden whitespace-nowrap transition-opacity duration-300">
              <div className="text-lg font-bold tracking-tight text-blue-600">
                Hakeem
              </div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                Premium Medical SaaS
              </div>
            </div>
          )}
        </div>

        <nav className="mt-4 flex-1 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/' && item.href !== '/doctor/patients');
              
              const isPatientsTab = item.label === "Patients";
              const isPatientsActive = isPatientsTab && pathname.startsWith('/doctor/patients');
              
              const finalIsActive = isPatientsActive || isActive;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center rounded-lg py-3 font-semibold transition-colors ${
                    isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-sm"
                  } ${
                    finalIsActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={finalIsActive ? "text-blue-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="hidden lg:block">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-4 py-6">
          <button 
            onClick={logout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-lg py-3 font-semibold text-red-500 transition-colors hover:bg-red-50 ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-sm"
            }`}
          >
            <LogoutIcon />
            {!isCollapsed && <span className="hidden lg:block">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
