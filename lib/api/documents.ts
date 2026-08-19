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

export async function detectDocumentMimeType(blob: Blob, fallbackName?: string): Promise<{ mimeType: string; blob: Blob }> {
  let mimeType = blob.type;

  if (mimeType && mimeType !== "application/octet-stream" && mimeType !== "binary/octet-stream") {
    return { mimeType, blob };
  }

  try {
    const buffer = await blob.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      mimeType = "application/pdf";
    } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      mimeType = "image/png";
    } else if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      mimeType = "image/jpeg";
    } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
      mimeType = "image/gif";
    } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      mimeType = "image/webp";
    }
  } catch (e) {
    console.error("Failed to inspect file signature:", e);
  }

  if (!mimeType || mimeType === "application/octet-stream" || mimeType === "binary/octet-stream") {
    const lower = (fallbackName || "").toLowerCase();
    if (lower.endsWith(".pdf")) mimeType = "application/pdf";
    else if (lower.endsWith(".png")) mimeType = "image/png";
    else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (lower.endsWith(".webp")) mimeType = "image/webp";
    else mimeType = "image/jpeg";
  }

  const correctedBlob = new Blob([blob], { type: mimeType });
  return { mimeType, blob: correctedBlob };
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

export interface MedicalRecordItem {
  medicalRecordId: string;
  recordType: string;
  displayName: string;
  clinicalDate: string;
  status: string;
}

export interface GetMedicalRecordsResponse {
  items: MedicalRecordItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface GetMedicalRecordsParams {
  search?: string;
  recordType?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export async function getDocumentMedicalRecords(
  documentId: string,
  params: GetMedicalRecordsParams = {}
): Promise<ApiResponse<GetMedicalRecordsResponse> | GetMedicalRecordsResponse> {
  const { data } = await api.get<ApiResponse<GetMedicalRecordsResponse> | GetMedicalRecordsResponse>(
    `/doctor/patients/medical-records/${documentId}`,
    { params }
  );
  return data;
}
