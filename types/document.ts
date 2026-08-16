export type MedicalDocument = {
  documentId: string;
  documentType: string;
  title: string;
  documentDate: string;
  extractionStatus: string;
  reviewStatus?: string;
  documentReviewStatus?: string;
  status?: string;
};

export interface ExtractedField {
  extractedFieldId: string;
  fieldName: string;
  extractedValue?: string;
  originalExtractedValue?: string;
  confirmedValue?: string;
  decision?: string;
  confidence: number;
  evidenceText: string;
  issues: string[];
  correctedValue?: string;
}

export interface ExtractedItem {
  extractedItemId: string;
  itemType: string;
  sequenceNumber: number;
  pageNumber: number;
  reviewStatus?: string;
  documentReviewStatus?: string;
  fields: ExtractedField[];
}

export interface DocumentExtractedData {
  documentId: string;
  documentType: string;
  extractionStatus: string;
  reviewStatus?: string;
  items: ExtractedItem[];
}

export interface ReviewFieldPayload {
  extractedFieldId: string;
  decision: "approved" | "rejected" | "corrected";
  correctedValue?: string;
}

export interface ReviewItemPayload {
  extractedItemId: string;
  fields: ReviewFieldPayload[];
}
