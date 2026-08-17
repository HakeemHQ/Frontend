import { api } from "./axios";
import {
  Doctor,
  User,
  AuditLog,
  ActivitySummary,
  PaginatedResponse,
  GetDoctorsParams,
  GetUsersParams,
  GetAuditLogsParams,
  CreateDoctorPayload,
  UpdateDoctorStatusPayload,
  UpdateUserStatusPayload
} from "../../types/admin";

export const adminApi = {
  createDoctor: async (payload: CreateDoctorPayload): Promise<Doctor> => {
    const { data } = await api.post<Doctor>("/admin/doctors", payload);
    return data;
  },

  getDoctors: async (params?: GetDoctorsParams): Promise<Doctor[]> => {
    const { data } = await api.get<Doctor[]>("/admin/doctors", { params });
    return data;
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    const { data } = await api.get<Doctor>(`/admin/doctors/${doctorId}`);
    return data;
  },

  updateDoctorStatus: async (doctorId: string, status: string): Promise<{ doctorId: string; status: string }> => {
    const { data } = await api.patch<{ doctorId: string; status: string }>(`/admin/doctors/${doctorId}/status`, { status });
    return data;
  },

  getUsers: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.search?.trim()) cleanParams.search = params.search.trim();
      if (params.userType?.trim()) cleanParams.userType = params.userType.trim();
      if (params.status?.trim()) cleanParams.status = params.status.trim();
      if (params.page !== undefined && params.page !== null) cleanParams.page = params.page;
      if (params.pageSize !== undefined && params.pageSize !== null) cleanParams.pageSize = params.pageSize;
    }
    const { data } = await api.get<PaginatedResponse<User>>("/admin/users", { params: cleanParams });
    return data;
  },

  updateUserStatus: async (userId: string, status: string): Promise<{ userId: string; status: string }> => {
    const { data } = await api.patch<{ userId: string; status: string }>(`/admin/users/${userId}/status`, { status });
    return data;
  },

  getAuditLogs: async (params?: GetAuditLogsParams): Promise<PaginatedResponse<AuditLog>> => {
    const { data } = await api.get<PaginatedResponse<AuditLog>>("/admin/audit-logs", { params });
    return data;
  },

  getActivitySummary: async (params: { fromDate: string; toDate: string }): Promise<ActivitySummary> => {
    const { data } = await api.get<ActivitySummary>("/admin/activity-summary", { params });
    return data;
  }
};
