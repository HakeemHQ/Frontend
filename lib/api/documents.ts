import { api } from "./axios";
import { MedicalDocument, DocumentExtractedData } from "@/types/document";

export interface GetPatientDocumentsParams {
  documentName?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string;
  data: T;
}

export async function getPatientDocuments(
  patientId: string, 
  params: GetPatientDocumentsParams = {}
): Promise<ApiResponse<MedicalDocument[]> | MedicalDocument[]> {
  const { data } = await api.get<ApiResponse<MedicalDocument[]> | MedicalDocument[]>(
    `/doctor/patients/${patientId}/documents`,
    { params }
  );
  return data;
}

export interface UploadPatientDocumentParams {
  patientProfileId?: string; // Optional if we just send patientId in URL, but added for safety
  file: File;
  title: string;
  documentDate: string;
}

export async function uploadPatientDocument(
  patientId: string,
  params: UploadPatientDocumentParams
): Promise<ApiResponse<MedicalDocument> | MedicalDocument> {
  const formData = new FormData();
  if (params.patientProfileId) {
    formData.append("PatientProfileId", params.patientProfileId);
  }
  formData.append("File", params.file);
  formData.append("Title", params.title);
  formData.append("DocumentDate", params.documentDate);

  const { data } = await api.post<ApiResponse<MedicalDocument> | MedicalDocument>(
    `/doctor/patients/${patientId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function getDocumentContent(documentId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/documents/${documentId}/content`, {
    responseType: "blob",
  });
  return data;
}

export async function deleteDocument(documentId: string): Promise<ApiResponse<string>> {
  const { data } = await api.delete<ApiResponse<string>>(`/documents/${documentId}`);
  return data;
}

export async function getDocumentExtractedFields(documentId: string): Promise<ApiResponse<DocumentExtractedData>> {
  const { data } = await api.get<ApiResponse<DocumentExtractedData>>(`/documents/${documentId}/extracted-fields`);
  return data;
}

export async function confirmAllExtractedItems(documentId: string): Promise<ApiResponse<any>> {
  const { data } = await api.put<ApiResponse<any>>(`/documents/${documentId}/extracted-items/confirm-all`);
  return data;
}

export async function reviewExtractedItem(extractedItemId: string, payload: any): Promise<ApiResponse<any>> {
  const { data } = await api.put<ApiResponse<any>>(`/extracted-items/${extractedItemId}/review`, payload);
  return data;
}
