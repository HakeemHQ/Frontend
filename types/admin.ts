export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  status: string;
}

export interface User {
  userId: string;
  email: string;
  userType: string;
  status: string;
  identityVerificationStatus: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName?: string;
  actorUserId?: string;
  target: string;
  timestamp?: string;
  occurredAt?: string;
  details?: string;
}

export interface ActivitySummary {
  fromDate: string;
  toDate: string;
  activePatients: number;
  activeDoctors: number;
  documentsUploaded: number;
  extractionsCompleted: number;
  medicalCvVersionsGenerated: number;
  activeUsers?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount?: number;
  totalPages?: number;
  total?: number;
}

export interface GetDoctorsParams {
  search?: string;
  specialty?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface GetUsersParams {
  search?: string;
  userType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface GetAuditLogsParams {
  action?: string;
  actorUserId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateDoctorPayload {
  email: string;
  fullName: string;
  specialty: string;
  temporaryPassword: string;
}

export interface UpdateDoctorStatusPayload {
  status: "Active" | "Suspended";
}

export interface UpdateUserStatusPayload {
  status: "Active" | "Suspended";
}
