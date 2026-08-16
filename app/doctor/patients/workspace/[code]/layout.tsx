"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const dataStr = sessionStorage.getItem(`access_${code}`);
      if (!dataStr) {
        router.replace("/doctor/patients?expired=true");
        return;
      }

      try {
        const accessData = JSON.parse(dataStr);
        if (!accessData?.expiresAt) {
          router.replace("/doctor/patients?expired=true");
          return;
        }

        let expiryString = accessData.expiresAt;
        if (typeof expiryString === 'string' && !expiryString.endsWith('Z')) {
          expiryString += 'Z';
        }
        
        const expires = new Date(expiryString).getTime();
        const now = new Date().getTime();

        if (expires <= now) {
          router.replace("/doctor/patients?expired=true");
        } else {
          setIsAuthorized(true);
        }
      } catch (e) {
        router.replace("/doctor/patients");
      }
    };

    checkAccess();
    
    // Optionally set up an interval to constantly check if it expired while they are on the page
    const interval = setInterval(checkAccess, 10000);
    return () => clearInterval(interval);
  }, [code, router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner className="w-8 h-8 text-emerald-600" />
      </div>
    );
  }

  return <>{children}</>;
}
