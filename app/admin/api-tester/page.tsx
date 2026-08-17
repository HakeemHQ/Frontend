"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminApi } from "@/lib/api/admin";
import { useLanguage } from "@/localization/LanguageContext";

type TestResult = {
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  error?: string;
  response?: any;
};

export default function ApiTesterPage() {
  const { t } = useLanguage();
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Create Doctor (POST /admin/doctors)", status: "pending" },
    { name: "Get Doctors (GET /admin/doctors)", status: "pending" },
    { name: "Get Doctor by ID (GET /admin/doctors/{id})", status: "pending" },
    { name: "Update Doctor Status (PATCH /admin/doctors/{id}/status)", status: "pending" },
    { name: "Get Users (GET /admin/users)", status: "pending" },
    { name: "Update User Status (PATCH /admin/users/{id}/status)", status: "pending" },
    { name: "Get Audit Logs (GET /admin/audit-logs)", status: "pending" },
    { name: "Get Activity Summary (GET /admin/activity-summary)", status: "pending" },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => {
      const newTests = [...prev];
      newTests[index] = { ...newTests[index], ...updates };
      return newTests;
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Reset tests
    setTests(tests.map(t => ({ ...t, status: "pending", error: undefined, response: undefined })));

    let createdDoctorId = "";
    let fetchedUserId = "";

    // 1. Create Doctor
    updateTest(0, { status: "running" });
    try {
      const doc = await adminApi.createDoctor({
        email: `test-${Date.now()}@hakeem.test`,
        fullName: "Test Doctor",
        specialty: "Cardiology",
        temporaryPassword: "Password123!"
      });
      createdDoctorId = doc.id;
      updateTest(0, { status: "passed", response: doc });
    } catch (e: any) {
      updateTest(0, { status: "failed", error: e.message || JSON.stringify(e) });
    }

    // 2. Get Doctors
    updateTest(1, { status: "running" });
    try {
      const res = await adminApi.getDoctors({ page: 1, pageSize: 5 });
      updateTest(1, { status: "passed", response: res });
    } catch (e: any) {
      updateTest(1, { status: "failed", error: e.message });
    }

    // 3. Get Doctor by ID
    updateTest(2, { status: "running" });
    if (createdDoctorId) {
      try {
        const doc = await adminApi.getDoctor(createdDoctorId);
        updateTest(2, { status: "passed", response: doc });
      } catch (e: any) {
        updateTest(2, { status: "failed", error: e.message });
      }
    } else {
      updateTest(2, { status: "failed", error: "Skipped because Doctor was not created" });
    }

    // 4. Update Doctor Status
    updateTest(3, { status: "running" });
    if (createdDoctorId) {
      try {
        const res = await adminApi.updateDoctorStatus(createdDoctorId, "Suspended");
        updateTest(3, { status: "passed", response: res });
      } catch (e: any) {
        updateTest(3, { status: "failed", error: e.message });
      }
    } else {
      updateTest(3, { status: "failed", error: "Skipped because Doctor was not created" });
    }

    // 5. Get Users
    updateTest(4, { status: "running" });
    try {
      const res = await adminApi.getUsers({ page: 1, pageSize: 5 });
      if (res.items && res.items.length > 0) {
        fetchedUserId = res.items[0].userId;
      }
      updateTest(4, { status: "passed", response: res });
    } catch (e: any) {
      updateTest(4, { status: "failed", error: e.message });
    }

    // 6. Update User Status
    updateTest(5, { status: "running" });
    if (fetchedUserId) {
      try {
        const res = await adminApi.updateUserStatus(fetchedUserId, "Suspended");
        updateTest(5, { status: "passed", response: res });
      } catch (e: any) {
        updateTest(5, { status: "failed", error: e.message });
      }
    } else {
      updateTest(5, { status: "failed", error: "Skipped because no User was found" });
    }

    // 7. Get Audit Logs
    updateTest(6, { status: "running" });
    try {
      const res = await adminApi.getAuditLogs({ page: 1, pageSize: 5 });
      updateTest(6, { status: "passed", response: res });
    } catch (e: any) {
      updateTest(6, { status: "failed", error: e.message });
    }

    // 8. Get Activity Summary
    updateTest(7, { status: "running" });
    try {
      const d = new Date();
      const toDate = d.toISOString().split("T")[0];
      d.setDate(d.getDate() - 10);
      const fromDate = d.toISOString().split("T")[0];

      const res = await adminApi.getActivitySummary({ fromDate, toDate });
      updateTest(7, { status: "passed", response: res });
    } catch (e: any) {
      updateTest(7, { status: "failed", error: e.message });
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-8 pb-8 mx-auto max-w-5xl">
      {/* Hero Header */}
      <div className="bg-primary rounded-[48px] p-12 md:p-16 text-white shadow-2xl shadow-primary/30 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 font-heading">
              {t('admin.apiTester.title')}
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-xl">
              {t('admin.apiTester.description')}
            </p>
          </div>
          <Button onClick={runTests} disabled={isRunning} className="bg-white hover:bg-slate-50 text-primary font-black rounded-full h-16 px-8 shadow-xl shadow-white/20 transition-all hover:-translate-y-1 text-xl border-none">
            {isRunning ? "Running Tests..." : "Run All API Tests"}
          </Button>
        </div>
      </div>

      <div className="-mt-16 relative z-20 px-4 md:px-8">
        <div className="rounded-[40px] border border-slate-100 bg-white overflow-hidden shadow-2xl shadow-slate-200/50">
          <div className="divide-y divide-slate-100">
          {tests.map((test, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">{test.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${test.status === 'passed' ? 'bg-emerald-50 text-emerald-600' :
                    test.status === 'failed' ? 'bg-red-50 text-red-600' :
                    test.status === 'running' ? 'bg-blue-50 text-blue-600 animate-pulse' :
                    'bg-slate-50 text-slate-600'
                  }
                `}>
                  {test.status.toUpperCase()}
                </span>
              </div>
              
              {test.error && (
                <div className="bg-red-50 text-red-800 text-sm p-4 rounded-lg font-mono mb-4">
                  {test.error}
                </div>
              )}
              
              {test.response && (
                <details className="text-sm bg-slate-50 rounded-lg border border-slate-100">
                  <summary className="p-3 cursor-pointer font-medium text-slate-600 hover:text-slate-900 outline-none">
                    View Response
                  </summary>
                  <div className="p-4 pt-0 overflow-x-auto">
                    <pre className="text-xs text-slate-700">
                      {JSON.stringify(test.response, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
