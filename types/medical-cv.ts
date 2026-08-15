export interface MedicalCvVersion {
  medicalCvVersionId: string;
  versionNumber: number;
  status: "queued" | "processing" | "ready" | "failed" | string;
  createdAt?: string;
  pdfUrl?: string | null;
  previewExpiresAt?: string;
}

export interface MedicalCv {
  medicalCvId: string;
  title: string;
  scopeType: string;
  focus: string | null;
  latestVersion: MedicalCvVersion | null;
}

export interface MedicalCvListResponse {
  items: MedicalCv[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PatientMedicalCvVersion {
  medicalCvVersionId: string;
  versionNumber: number;
  status: string;
  createdAt: string;
  pdfFileKey: string | null;
}

export interface PatientMedicalCv {
  medicalCvId: string;
  title: string;
  scopeType: string;
  focus: string | null;
  versions: PatientMedicalCvVersion[];
}
