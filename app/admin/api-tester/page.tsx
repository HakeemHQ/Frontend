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
        fullName: "Test Doctor " + Math.floor(Math.random() * 1000),
        email: `testdoc${Date.now()}@hakeem.test`,
        specialty: "Cardiology",
        temporaryPassword: "Password123!"
      });
      createdDoctorId = (doc as any).id || (doc as any).doctorId;
      updateTest(0, { status: "passed", response: doc });
    } catch (e: any) {
      updateTest(0, { status: "failed", error: e.message });
    }

    // 2. Get Doctors
    updateTest(1, { status: "running" });
    try {
      const docs = await adminApi.getDoctors();
      updateTest(1, { status: "passed", response: docs });
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
      updateTest(2, { status: "failed", error: "Skipped: No doctor created" });
    }

    // 4. Update Doctor Status
    updateTest(3, { status: "running" });
    if (createdDoctorId) {
      try {
        const doc = await adminApi.updateDoctorStatus(createdDoctorId, "Suspended");
        updateTest(3, { status: "passed", response: doc });
      } catch (e: any) {
        updateTest(3, { status: "failed", error: e.message });
      }
    } else {
      updateTest(3, { status: "failed", error: "Skipped: No doctor created" });
    }

    // 5. Get Users
    updateTest(4, { status: "running" });
    try {
      const users = await adminApi.getUsers();
      const items = (users as any).items || (Array.isArray(users) ? users : []);
      if (items.length > 0) {
        fetchedUserId = items[0].id || items[0].userId;
      }
      updateTest(4, { status: "passed", response: users });
    } catch (e: any) {
      updateTest(4, { status: "failed", error: e.message });
    }

    // 6. Update User Status
    updateTest(5, { status: "running" });
    if (fetchedUserId) {
      try {
        const res = await adminApi.updateUserStatus(fetchedUserId, "Active");
        updateTest(5, { status: "passed", response: res });
      } catch (e: any) {
        updateTest(5, { status: "failed", error: e.message });
      }
    } else {
      updateTest(5, { status: "failed", error: "Skipped: No user available to update" });
    }

    // 7. Get Audit Logs
    updateTest(6, { status: "running" });
    try {
      const logs = await adminApi.getAuditLogs();
      updateTest(6, { status: "passed", response: logs });
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
    <div className="space-y-6 pb-12 mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero Header */}
      <div className="bg-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-primary/20 relative min-h-[140px] flex flex-col justify-center">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              {t('admin.apiTester.title')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/80 font-medium max-w-xl">
              {t('admin.apiTester.description')}
            </p>
          </div>
          <button 
            onClick={runTests} 
            disabled={isRunning} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:-translate-y-0.5 shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning ? "Running Tests..." : "Run All API Tests"}
          </button>
        </div>
      </div>

      <div className="-mt-6 relative z-10">
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {tests.map((test, index) => (
              <div key={index} className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-slate-900">{test.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold
                    ${test.status === 'passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      test.status === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      test.status === 'running' ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse' :
                      'bg-slate-50 text-slate-600 border border-slate-200'
                    }
                  `}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                
                {test.error && (
                  <div className="bg-rose-50 text-rose-800 text-xs p-3 rounded-lg font-mono mb-2">
                    {test.error}
                  </div>
                )}
                
                {test.response && (
                  <details className="text-xs bg-slate-50 rounded-lg border border-slate-100">
                    <summary className="p-2.5 cursor-pointer font-medium text-slate-600 hover:text-slate-900 outline-none">
                      View Response
                    </summary>
                    <div className="p-3 pt-0 overflow-x-auto">
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
    </div>
  );
}
