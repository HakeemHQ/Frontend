import { create } from "zustand";
import { Doctor, User, AuditLog, ActivitySummary, PaginatedResponse } from "@/types/admin";
import { adminApi } from "@/lib/api/admin";

export type AdminState = {
  // Doctors
  doctors: Doctor[] | null;
  isDoctorsLoading: boolean;
  doctorsError: string | null;
  fetchDoctors: () => Promise<void>;
  
  // Single Doctor
  currentDoctor: Doctor | null;
  isDoctorLoading: boolean;
  doctorError: string | null;
  fetchDoctor: (id: string) => Promise<void>;
  updateDoctorStatus: (id: string, status: "active" | "suspended" | "Active" | "Suspended") => Promise<void>;

  // Users
  users: PaginatedResponse<User> | null;
  isUsersLoading: boolean;
  usersError: string | null;
  fetchUsers: (params: { search?: string; userType?: string; status?: string; page?: number; pageSize?: number }) => Promise<void>;
  updateUserStatus: (id: string, status: "Active" | "Suspended") => Promise<void>;

  // Audit Logs
  auditLogs: PaginatedResponse<AuditLog> | null;
  isAuditLogsLoading: boolean;
  auditLogsError: string | null;
  fetchAuditLogs: (params: { action?: string; actorUserId?: string; fromDate?: string; toDate?: string; page?: number; pageSize?: number }) => Promise<void>;

  // Activity Summary
  activitySummary: ActivitySummary | null;
  isActivitySummaryLoading: boolean;
  activitySummaryError: string | null;
  fetchActivitySummary: (params: { fromDate: string; toDate: string }) => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  // Doctors
  doctors: [],
  isDoctorsLoading: false,
  doctorsError: null,
  fetchDoctors: async () => {
    set({ isDoctorsLoading: true, doctorsError: null });
    try {
      const data: any = await adminApi.getDoctors();
      let doctorList: any[] = [];
      if (Array.isArray(data)) {
        doctorList = data;
      } else if (data && Array.isArray(data.items)) {
        doctorList = data.items;
      } else if (data && Array.isArray(data.doctors)) {
        doctorList = data.doctors;
      } else if (data && Array.isArray(data.data)) {
        doctorList = data.data;
      } else if (data && typeof data === "object") {
        const potentialArray = Object.values(data).find((val) => Array.isArray(val));
        if (potentialArray) {
          doctorList = potentialArray as any[];
        }
      }

      const normalizedDoctors: Doctor[] = doctorList.map((doc: any) => ({
        id: doc.id || doc.doctorId || doc.userId || String(Math.random()),
        name: doc.name || doc.fullName || `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || doc.email || "Doctor",
        email: doc.email || "",
        specialty: doc.specialty || "General",
        licenseNumber: doc.licenseNumber || "N/A",
        status: doc.status || "Active",
        ...doc,
      }));

      set({ doctors: normalizedDoctors, isDoctorsLoading: false });
    } catch (error: any) {
      set({ 
        doctors: [],
        doctorsError: error.response?.data?.message || error.message || "Failed to fetch doctors",
        isDoctorsLoading: false 
      });
    }
  },

  // Single Doctor
  currentDoctor: null,
  isDoctorLoading: false,
  doctorError: null,
  fetchDoctor: async (id) => {
    set({ isDoctorLoading: true, doctorError: null });
    try {
      const data: any = await adminApi.getDoctor(id);
      const normalizedDoctor: Doctor = {
        id: data?.id || data?.doctorId || data?.userId || id,
        name: data?.name || data?.fullName || `${data?.firstName || ""} ${data?.lastName || ""}`.trim() || data?.email || "Doctor",
        email: data?.email || "",
        specialty: data?.specialty || "General",
        licenseNumber: data?.licenseNumber || "N/A",
        status: data?.status || "Active",
        ...data,
      };
      set({ currentDoctor: normalizedDoctor, isDoctorLoading: false });
    } catch (error: any) {
      set({ 
        doctorError: error.response?.data?.message || error.message || "Failed to fetch doctor details",
        isDoctorLoading: false 
      });
    }
  },
  updateDoctorStatus: async (id, status) => {
    try {
      await adminApi.updateDoctorStatus(id, status);
      const currentDoctor = get().currentDoctor;
      if (currentDoctor && (currentDoctor.id === id || (currentDoctor as any).doctorId === id)) {
        set({ currentDoctor: { ...currentDoctor, status } });
      }
      const doctors = get().doctors;
      if (Array.isArray(doctors)) {
        set({
          doctors: doctors.map((d: any) => (d.id === id || d.doctorId === id ? { ...d, status } : d)),
        });
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Users
  users: null,
  isUsersLoading: false,
  usersError: null,
  fetchUsers: async (params) => {
    set({ isUsersLoading: true, usersError: null });
    try {
      const data: any = await adminApi.getUsers(params);
      let items: User[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
      } else if (data && Array.isArray(data.users)) {
        items = data.users;
      }
      const normalizedUsers = items.map((u: any) => ({
        userId: u.userId || u.id || "",
        email: u.email || "",
        userType: u.userType || u.role || "User",
        status: u.status || "Active",
        identityVerificationStatus: u.identityVerificationStatus || "Unverified",
        ...u,
      }));
      const pageSize = params?.pageSize || 10;
      const currentPage = params?.page || 1;
      
      const hasExplicitTotal = data?.totalCount !== undefined || data?.total !== undefined || data?.totalItems !== undefined;
      const explicitTotal = data?.totalCount ?? data?.total ?? data?.totalItems;
      
      let totalCount: number;
      let totalPages: number;

      if (hasExplicitTotal && typeof explicitTotal === 'number') {
        totalCount = explicitTotal;
        totalPages = data?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
      } else {
        if (normalizedUsers.length < pageSize) {
          totalCount = (currentPage - 1) * pageSize + normalizedUsers.length;
          totalPages = currentPage;
        } else {
          totalCount = currentPage * pageSize + 1;
          totalPages = currentPage + 1;
        }
      }

      set({ 
        users: { 
          items: normalizedUsers, 
          totalCount,
          totalPages,
          total: totalCount
        }, 
        isUsersLoading: false 
      });
    } catch (error: any) {
      set({ 
        users: { items: [], totalCount: 0, totalPages: 1, total: 0 },
        usersError: error.response?.data?.message || error.message || "Failed to fetch users",
        isUsersLoading: false 
      });
    }
  },
  updateUserStatus: async (id, status) => {
    try {
      await adminApi.updateUserStatus(id, status);
      const users = get().users;
      if (users && Array.isArray(users.items)) {
        set({
          users: {
            ...users,
            items: users.items.map((u: any) => (u.userId === id || u.id === id ? { ...u, status } : u)),
          },
        });
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Audit Logs
  auditLogs: null,
  isAuditLogsLoading: false,
  auditLogsError: null,
  fetchAuditLogs: async (params) => {
    set({ isAuditLogsLoading: true, auditLogsError: null });
    try {
      const data: any = await adminApi.getAuditLogs(params);
      let items: AuditLog[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
      } else if (data && Array.isArray(data.logs)) {
        items = data.logs;
      }
      const normalizedLogs = items.map((l: any) => ({
        id: l.id || l.auditLogId || String(Math.random()),
        action: l.action || "Unknown",
        actorName: l.actorName || l.actorUserId || "System",
        actorUserId: l.actorUserId || l.actorId || "",
        target: l.target || "",
        timestamp: l.timestamp || l.occurredAt || new Date().toISOString(),
        occurredAt: l.occurredAt || l.timestamp || new Date().toISOString(),
        details: l.details || "",
        ...l,
      }));
      set({ 
        auditLogs: { 
          items: normalizedLogs, 
          totalCount: data?.totalCount ?? data?.total ?? normalizedLogs.length,
          totalPages: data?.totalPages ?? 1,
          total: data?.total ?? normalizedLogs.length
        }, 
        isAuditLogsLoading: false 
      });
    } catch (error: any) {
      set({ 
        auditLogs: { items: [], totalCount: 0, totalPages: 1, total: 0 },
        auditLogsError: error.response?.data?.message || error.message || "Failed to fetch audit logs",
        isAuditLogsLoading: false 
      });
    }
  },

  // Activity Summary
  activitySummary: null,
  isActivitySummaryLoading: false,
  activitySummaryError: null,
  fetchActivitySummary: async (params) => {
    set({ isActivitySummaryLoading: true, activitySummaryError: null });
    try {
      const data = await adminApi.getActivitySummary(params);
      set({ activitySummary: data, isActivitySummaryLoading: false });
    } catch (error: any) {
      set({ 
        activitySummaryError: error.response?.data?.message || error.message || "Failed to fetch activity summary",
        isActivitySummaryLoading: false 
      });
    }
  },
}));
