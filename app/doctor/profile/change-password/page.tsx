"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/localization/LanguageContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  LockIcon, 
  ViewIcon, 
  ViewOffIcon, 
  Key01Icon 
} from "@hugeicons/core-free-icons";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function DoctorChangePasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      // Simulate/Trigger change password
      setToast({ message: "Password updated successfully", type: "success" });
      setTimeout(() => {
        router.push("/doctor/profile");
      }, 1200);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update password", type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/doctor/profile" className="inline-flex items-center gap-1 transition hover:text-primary">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('doctor.profile.title')}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">Change Password</span>
      </nav>

      {/* Form Card */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3.5 pb-5 mb-5 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Key01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading">
              Change Password
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              Update your account credentials securely
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Current Password</label>
            <Input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              iconLeft={<HugeiconsIcon icon={LockIcon} className="h-4 w-4 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                >
                  <HugeiconsIcon icon={showCurrent ? ViewOffIcon : ViewIcon} className="h-4 w-4" />
                </button>
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">New Password</label>
            <Input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password (min 8 characters)"
              {...register("newPassword")}
              error={errors.newPassword?.message}
              iconLeft={<HugeiconsIcon icon={LockIcon} className="h-4 w-4 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                >
                  <HugeiconsIcon icon={showNew ? ViewOffIcon : ViewIcon} className="h-4 w-4" />
                </button>
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              iconLeft={<HugeiconsIcon icon={LockIcon} className="h-4 w-4 text-slate-400" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                >
                  <HugeiconsIcon icon={showConfirm ? ViewOffIcon : ViewIcon} className="h-4 w-4" />
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Link href="/doctor/profile">
              <Button variant="outline" type="button" disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="px-5 py-2 text-xs font-semibold">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
