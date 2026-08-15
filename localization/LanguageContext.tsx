"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import enMessages from "./EN/common.json";
import arMessages from "./AR/common.json";

export type SupportedLocale = "en" | "ar";

const messages: Record<SupportedLocale, Record<string, unknown>> = {
  en: enMessages,
  ar: arMessages,
};

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, fallback?: string) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "hakeem_locale";

/**
 * Resolve a dot-separated key from a nested object.
 * e.g. t("auth.login.title") -> messages.auth.login.title
 */
function resolveKey(obj: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  // Load saved locale on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
      if (saved === "ar" || saved === "en") {
        setLocaleState(saved);
      }
    }
  }, []);

  // Update HTML attributes when locale changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", locale);
      document.documentElement.setAttribute("dir", dir);
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const value = resolveKey(messages[locale] as Record<string, unknown>, key);
      if (value !== undefined) return value;
      // Fallback to English
      const enValue = resolveKey(messages.en as Record<string, unknown>, key);
      if (enValue !== undefined) return enValue;
      // Return the fallback or the key itself
      return fallback ?? key;
    },
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export { LanguageContext };
