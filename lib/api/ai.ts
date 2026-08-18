import { api } from "./axios";

export interface AiSource {
  medicalRecordId: string;
  recordType: string;
  displayName: string;
}

export interface AiQuestionResponse {
  message: string;
  ragResults: AiSource[];
  generatedCv?: {
    medicalCvId: string;
    medicalCvVersionId: string;
    title: string;
    focus: string;
    status: string;
    versionNumber: number;
    previewUrl: string;
    previewExpiresAt: string;
    createdAt: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string;
  data: T;
}

export async function askAiQuestion(patientId: string, question: string): Promise<ApiResponse<AiQuestionResponse> | AiQuestionResponse> {
  const { data } = await api.post<ApiResponse<AiQuestionResponse> | AiQuestionResponse>(`/doctor/patients/${patientId}/ai/questions`, {
    message: question
  });
  return data;
}
