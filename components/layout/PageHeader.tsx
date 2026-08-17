"use client";

import { useLanguage } from "@/localization/LanguageContext";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base text-slate-500">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
