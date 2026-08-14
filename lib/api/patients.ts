import { api } from "./axios";

export interface PatientAccessSession {
  accessId: string;
  patientId: string;
  patientCode: string;
  fullName: string;
  expiresAt: string;
}

export interface PatientAccessResponse {
  items: PatientAccessSession[];
  totalCount?: number; // assuming standard pagination fields
}

export async function getPatients(page = 1, pageSize = 10, status?: string): Promise<PatientAccessResponse> {
  const params: any = { PageNumber: page, PageSize: pageSize };
  if (status && status !== "All") {
    params.status = status.toLowerCase();
  }
  
  const { data } = await api.get<PatientAccessResponse>("/doctor/patient-access", {
    params,
  });
  return data;
}

export interface VerifyPatientParams {
  patientCode: string;
  nationalId: string;
}

export interface VerifyPatientResponse {
  patientId: string;
  patientCode: string;
  fullName: string;
  identityVerificationStatus: string;
  claimCorrected: boolean;
  verifiedAt: string;
}

export async function verifyPatientIdentity(params: VerifyPatientParams): Promise<VerifyPatientResponse> {
  const { data } = await api.post<VerifyPatientResponse>("/doctor/patient-identities/verify", params);
  return data;
}

export interface RequestAccessParams {
  patientCode: string;
}

export interface RequestAccessResponse {
  requestId: string;
  status: string;
  requestedAt: string;
}

export async function requestPatientAccess(params: RequestAccessParams): Promise<RequestAccessResponse> {
  const { data } = await api.post<RequestAccessResponse>("/doctor/patient-access-requests", params);
  return data;
}

export interface RedeemAccessParams {
  patientCode: string;
  oneTimeCode: string;
}

export interface RedeemAccessResponse {
  accessId: string;
  patientId: string;
  patient: {
    patientCode: string;
    fullName: string;
    birthDate: string;
  };
  grantedAt: string;
  expiresAt: string;
}

export async function redeemPatientAccess(params: RedeemAccessParams): Promise<RedeemAccessResponse> {
  const { data } = await api.post<RedeemAccessResponse>("/doctor/patient-access-sessions", params);
  return data;
}

