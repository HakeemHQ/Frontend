import { create } from "zustand";
import { MedicalDocument } from "@/types/document";
import { getPatientDocuments, uploadPatientDocument, deleteDocument } from "@/lib/api/documents";

export type PatientDocumentsState = {
  documents: MedicalDocument[];
  isLoading: boolean;
  error: string | null;
  patientId: string | null;
  
  setPatientId: (patientId: string) => void;
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

  clearError: () => set({ error: null }),

  setPatientId: (patientId) => {
    set({ patientId });
    get().fetchDocuments(patientId);
  },

  fetchDocuments: async (passedPatientId, params = {}) => {
    const patientId = passedPatientId || get().patientId;
    
    if (!patientId) {
      set({ error: "Patient ID is required" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await getPatientDocuments(patientId, params);

      const isArray = Array.isArray(response);
      const actualData: any = isArray ? response : (response as any).data;
      const isSuccess = isArray ? true : (response as any).success;

      let docsArray: MedicalDocument[] = [];
      if (Array.isArray(actualData)) {
        docsArray = actualData;
      } else if (actualData && Array.isArray(actualData.items)) {
        docsArray = actualData.items;
      } else if (actualData && Array.isArray(actualData.data)) {
        docsArray = actualData.data;
      }

      if (isSuccess) {
        set({
          documents: docsArray,
          isLoading: false,
        });
      } else {
        set({ error: (response as any).message || "Failed to fetch patient documents", isLoading: false });
      }
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
      
      const isSuccess = 'success' in response ? (response as any).success : true;
      const actualData = 'success' in response ? (response as any).data : response;

      if (isSuccess && actualData) {
        set((state) => ({
          documents: [actualData as MedicalDocument, ...state.documents],
          isLoading: false,
        }));
        return actualData as MedicalDocument;
      } else {
        set({ error: (response as any).message || "Failed to upload document", isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred while uploading", 
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
      const response = await confirmAllExtractedItems(documentId);
      
      const isSuccess = 'success' in response ? (response as any).success : true;
      const actualData = 'success' in response ? (response as any).data : response;

      if (isSuccess) {
        set({ isLoading: false });
        return actualData;
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
