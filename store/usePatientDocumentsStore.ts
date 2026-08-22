import { create } from "zustand";
import { MedicalDocument } from "@/types/document";
import { getPatientDocuments, uploadPatientDocument, deleteDocument } from "@/lib/api/documents";

export type PatientDocumentsState = {
  documents: MedicalDocument[];
  isLoading: boolean;
  error: string | null;
  patientId: string | null;
  
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  
  setPatientId: (patientId: string) => void;
  setPageNumber: (pageNumber: number) => void;
  fetchDocuments: (patientId?: string, params?: { documentName?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  uploadDocument: (patientId: string, params: { file: File; title: string; documentDate: string; patientProfileId?: string }) => Promise<MedicalDocument | false>;
  deleteDocument: (documentId: string) => Promise<boolean>;
  confirmExtractedData: (documentId: string) => Promise<any>;
  reviewExtractedItem: (extractedItemId: string, payload: any) => Promise<any>;
  clearError: () => void;
};

export const usePatientDocumentsStore = create<PatientDocumentsState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,
  patientId: null,
  pageNumber: 1,
  pageSize: 20,
  totalCount: 0,

  clearError: () => set({ error: null }),

  setPatientId: (patientId) => {
    set({ patientId, pageNumber: 1 });
    get().fetchDocuments(patientId);
  },

  setPageNumber: (pageNumber) => {
    set({ pageNumber });
    get().fetchDocuments(undefined, { pageNumber });
  },

  fetchDocuments: async (passedPatientId, params = {}) => {
    const patientId = passedPatientId || get().patientId;
    const pageNumber = params.pageNumber || get().pageNumber;
    const pageSize = params.pageSize || get().pageSize;
    
    if (!patientId) {
      set({ error: "Patient ID is required" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await getPatientDocuments(patientId, { ...params, pageNumber, pageSize });

      const isArray = Array.isArray(response);
      const isFailed = typeof response === 'object' && response !== null && 'success' in response && (response as any).success === false;

      if (isFailed) {
        set({ error: (response as any).message || "Failed to fetch patient documents", isLoading: false });
        return;
      }

      const rawData: any = isArray ? response : ((response as any).data !== undefined ? (response as any).data : response);

      let docsArray: MedicalDocument[] = [];
      let totalCount = 0;
      
      if (Array.isArray(rawData)) {
        docsArray = rawData;
        totalCount = rawData.length;
      } else if (rawData && Array.isArray(rawData.items)) {
        docsArray = rawData.items;
        totalCount = rawData.totalCount || rawData.items.length;
      } else if (rawData && Array.isArray(rawData.data)) {
        docsArray = rawData.data;
        totalCount = rawData.totalCount || rawData.data.length;
      }

      set({
        documents: docsArray,
        totalCount,
        pageNumber,
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isLoading: false 
      });
    }
  },

  uploadDocument: async (patientId, params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await uploadPatientDocument(patientId, params);
      
      const isFailed = typeof response === 'object' && response !== null && 'success' in response && (response as any).success === false;

      if (isFailed) {
        set({ error: (response as any).message || "Failed to upload document", isLoading: false });
        return false;
      }

      const actualData = typeof response === 'object' && response !== null && 'data' in response && (response as any).data !== undefined
        ? (response as any).data 
        : response;

      if (actualData) {
        set((state) => ({
          documents: [actualData as MedicalDocument, ...state.documents],
          isLoading: false,
        }));
        return actualData as MedicalDocument;
      } else {
        set({ error: "Failed to upload document", isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "doctor.documents.uploadFailed", 
        isLoading: false 
      });
      return false;
    }
  },

  deleteDocument: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deleteDocument(documentId);
      const isSuccess = 'success' in response ? (response as any).success : true;

      if (isSuccess) {
        set((state) => ({
          documents: state.documents.filter(doc => doc.documentId !== documentId),
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: (response as any).message || "Failed to delete document", isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred while deleting", 
        isLoading: false 
      });
      return false;
    }
  },

  confirmExtractedData: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      const { confirmAllExtractedItems } = await import("@/lib/api/documents");
      const response: any = await confirmAllExtractedItems(documentId);
      
      const isFailed = typeof response === 'object' && response !== null && 'success' in response && response.success === false;

      if (!isFailed) {
        // Optimistically update document in state.documents
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.documentId === documentId
              ? { ...doc, reviewStatus: "reviewed", documentReviewStatus: "reviewed" }
              : doc
          ),
          isLoading: false,
        }));

        const actualData = typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined
          ? response.data 
          : response;

        return actualData || true;
      } else {
        set({ error: (response as any).message || "Failed to confirm extracted data", isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isLoading: false 
      });
      return false;
    }
  },

  reviewExtractedItem: async (extractedItemId, payload) => {
    set({ isLoading: true, error: null });
    try {
      const { reviewExtractedItem } = await import("@/lib/api/documents");
      const response = await reviewExtractedItem(extractedItemId, payload);
      
      const isSuccess = 'success' in response ? (response as any).success : true;
      const actualData = 'success' in response ? (response as any).data : response;

      if (isSuccess) {
        set({ isLoading: false });
        return actualData;
      } else {
        set({ error: (response as any).message || "Failed to review extracted item", isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isLoading: false 
      });
      return false;
    }
  },
}));
