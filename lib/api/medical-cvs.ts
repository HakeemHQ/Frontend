import { api } from "./axios";
import { MedicalCvListResponse, MedicalCv, PatientMedicalCv } from "@/types/medical-cv";

export interface GetMedicalCvsParams {
  Search?: string;
  Page?: number;
  PageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string;
  data: T;
}

export async function getMedicalCvs(params: GetMedicalCvsParams = {}): Promise<ApiResponse<MedicalCvListResponse>> {
  const { data } = await api.get<ApiResponse<MedicalCvListResponse>>("/medical-cvs", {
    params,
  });
  return data;
}

export interface CreateMedicalCvParams {
  title: string;
}

export async function createMedicalCv(params: CreateMedicalCvParams): Promise<ApiResponse<MedicalCv>> {
  const { data } = await api.post<ApiResponse<MedicalCv>>("/medical-cvs", params);
  return data;
}

export async function getPatientMedicalCvs(patientId: string): Promise<ApiResponse<PatientMedicalCv[]> | PatientMedicalCv[]> {
  const { data } = await api.get<ApiResponse<PatientMedicalCv[]> | PatientMedicalCv[]>(`/doctor/patients/${patientId}/medical-cvs`);
  return data;
}

export interface CreatePatientMedicalCvParams {
  title: string;
}

export async function createPatientMedicalCv(patientId: string, params: CreatePatientMedicalCvParams): Promise<ApiResponse<PatientMedicalCv> | PatientMedicalCv> {
  const { data } = await api.post<ApiResponse<PatientMedicalCv> | PatientMedicalCv>(`/doctor/patients/${patientId}/medical-cvs`, params);
  return data;
}
