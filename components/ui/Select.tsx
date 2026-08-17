"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  variant?: "default" | "hero";
  label?: string;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "", 
  error,
  variant = "default",
  label
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isHero = variant === "hero";

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className={`text-xs font-bold uppercase tracking-wider pl-2 block ${isHero ? "text-white/70" : "text-slate-600"}`}>
          {label}
        </span>
      )}
      <div className={`relative w-full ${isOpen ? "z-[70]" : "z-auto"}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex w-full items-center justify-between transition-all duration-200 outline-none cursor-pointer select-none ${
            isHero
              ? `rounded-[20px] px-4 py-3.5 text-base font-bold backdrop-blur-md border ${
                  isOpen
                    ? "bg-white/30 border-white text-white shadow-lg ring-2 ring-white/30"
                    : "bg-white/20 hover:bg-white/25 border-white/10 text-white"
                }`
              : `rounded-2xl border px-5 py-3.5 text-sm font-semibold ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 bg-red-50"
                    : isOpen
                    ? "border-primary ring-4 ring-primary/10 bg-white text-slate-900 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-900 shadow-sm"
                }`
          }`}
        >
          <span className={`truncate ${
            isHero 
              ? (selectedOption ? "text-white" : "text-white/60") 
              : (selectedOption ? (error ? "text-red-900" : "text-slate-900") : "text-slate-400")
          }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <HugeiconsIcon 
            icon={ArrowDown01Icon} 
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isHero ? "text-white/80" : (error ? "text-red-400" : "text-slate-400")
            } ${isOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-[100] mt-2 min-w-[200px] overflow-hidden rounded-[24px] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
            <ul className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-1">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange?.(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-sm font-bold transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 text-white shrink-0 ml-2" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1 pl-2">
          {error}
        </p>
      )}
    </div>
  );
}
