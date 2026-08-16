import { api } from "./axios";
import { PatientMedicalCv, MedicalCvDetails, PreviewLinkResponse } from "@/types/medical-cv";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string;
  data: T;
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

export async function getMedicalCvById(cvId: string): Promise<ApiResponse<MedicalCvDetails> | MedicalCvDetails> {
  const { data } = await api.get<ApiResponse<MedicalCvDetails> | MedicalCvDetails>(`/medical-cvs/${cvId}`);
  return data;
}

export async function getMedicalCvPdf(versionId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/medical-cv-versions/${versionId}/pdf`, {
    responseType: "blob",
  });
  return data;
}

export async function getMedicalCvPreviewLink(versionId: string): Promise<ApiResponse<PreviewLinkResponse> | PreviewLinkResponse> {
  const { data } = await api.post<ApiResponse<PreviewLinkResponse> | PreviewLinkResponse>(`/medical-cv-versions/${versionId}/preview-link`);
  return data;
}

export async function approveMedicalCvVersion(versionId: string): Promise<ApiResponse<any> | any> {
  const { data } = await api.post<ApiResponse<any> | any>(`/medical-cv-versions/${versionId}/approval`);
  return data;
}
