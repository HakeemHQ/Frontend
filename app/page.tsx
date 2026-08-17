"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      const userType = decodedPayload.userType || decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (userType === "Admin") {
        router.replace("/admin/dashboard");
      } else if (userType === "Doctor") {
        router.replace("/doctor/patients");
      } else {
        router.replace("/login"); 
      }
    } catch (e) {
      authStorage.clearTokens();
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-16 w-16 animate-spin rounded-full border-[6px] border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
    </div>
  );
}
