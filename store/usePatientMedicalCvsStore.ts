import { create } from "zustand";
import { PatientMedicalCv, MedicalCvDetails } from "@/types/medical-cv";
import { getPatientMedicalCvs, createPatientMedicalCv, getMedicalCvById, getMedicalCvPreviewLink, approveMedicalCvVersion, getMedicalCvPdf } from "@/lib/api/medical-cvs";

export type PatientMedicalCvsState = {
  cvs: PatientMedicalCv[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  patientId: string | null;
  currentCvDetails: MedicalCvDetails | null;
  isFetchingDetails: boolean;
  
  setPatientId: (patientId: string) => void;
  fetchCvs: (patientId?: string) => Promise<void>;
  fetchCvDetails: (cvId: string) => Promise<void>;
  createCv: (title: string, patientId?: string, language?: string) => Promise<boolean>;
  generatePreviewLink: (versionId: string) => Promise<string | null>;
  fetchVersionPdf: (versionId: string) => Promise<string | null>;
  approveVersion: (versionId: string, cvId: string) => Promise<boolean>;
  clearError: () => void;
};

export const usePatientMedicalCvsStore = create<PatientMedicalCvsState>((set, get) => ({
  cvs: [],
  isLoading: false,
  isCreating: false,
  error: null,
  patientId: null,
  currentCvDetails: null,
  isFetchingDetails: false,

  clearError: () => set({ error: null }),

  setPatientId: (patientId) => {
    set({ patientId });
    get().fetchCvs(patientId);
  },

  fetchCvs: async (passedPatientId) => {
    const patientId = passedPatientId || get().patientId;
    
    if (!patientId) {
      set({ error: "Patient ID is required" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await getPatientMedicalCvs(patientId);

      // The backend might return the array directly, or wrap it in { data: ... } or { items: ... }
      let isSuccess = true;
      let actualData: any = [];

      if (Array.isArray(response)) {
        actualData = response;
      } else if (response && typeof response === 'object') {
        if ('success' in response && response.success === false) {
          isSuccess = false;
        }
        
        if (response.data && Array.isArray(response.data)) {
          actualData = response.data;
        } else if ((response as any).items) {
          const resItems = (response as any).items;
          if (Array.isArray(resItems)) {
            actualData = resItems;
          } else if (resItems.items && Array.isArray(resItems.items)) {
            // Handle double-nested items: { items: { items: [...] } }
            actualData = resItems.items;
          }
        } else if ('success' in response && response.data) {
          actualData = response.data;
        }
      }

      if (isSuccess) {
        set({
          cvs: Array.isArray(actualData) ? actualData : [],
          isLoading: false,
        });
      } else {
        set({ error: (response as any).message || "Failed to fetch patient CVs", isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isLoading: false 
      });
    }
  },

  createCv: async (title: string, passedPatientId?: string, language?: string) => {
    const patientId = passedPatientId || get().patientId;
    if (!patientId) {
      set({ error: "Patient ID is required to create a CV" });
      return false;
    }

    set({ isCreating: true, error: null });
    try {
      const response = await createPatientMedicalCv(patientId, { title }, language);
      // The backend might return the object directly or wrap it in an ApiResponse
      const isSuccess = 'success' in response ? response.success : true;
      const actualData = 'success' in response ? response.data : response;

      if (isSuccess && actualData) {
        set((state) => ({
          cvs: [actualData as PatientMedicalCv, ...state.cvs],
          isCreating: false,
        }));
        return true;
      } else {
        set({ error: (response as any).message || "Failed to create patient CV", isCreating: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred while creating CV", 
        isCreating: false 
      });
      return false;
    }
  },

  fetchCvDetails: async (cvId: string) => {
    set({ isFetchingDetails: true, error: null });
    try {
      const response = await getMedicalCvById(cvId);
      const isSuccess = 'success' in response ? response.success : true;
      const actualData = 'success' in response ? response.data : response;

      if (isSuccess) {
        set({
          currentCvDetails: actualData as MedicalCvDetails,
          isFetchingDetails: false,
        });
      } else {
        set({ error: (response as any).message || "Failed to fetch CV details", isFetchingDetails: false });
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred while fetching CV details", 
        isFetchingDetails: false 
      });
    }
  },

  fetchVersionPdf: async (versionId: string) => {
    try {
      const blob = await getMedicalCvPdf(versionId);
      if (blob && blob.size > 0) {
        const url = URL.createObjectURL(blob);
        return url;
      }
      set({ error: "Empty PDF content received" });
      return null;
    } catch (error: any) {
      let errMsg = "Failed to load PDF preview";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          errMsg = json.message || errMsg;
        } catch (e) {}
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      set({ error: errMsg });
      return null;
    }
  },

  generatePreviewLink: async (versionId: string) => {
    try {
      const response: any = await getMedicalCvPreviewLink(versionId);
      
      const isFailed = typeof response === 'object' && response !== null && 'success' in response && response.success === false;
      if (isFailed) {
        set({ error: response.message || "Failed to generate preview link" });
        return null;
      }

      const actualData = typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined
        ? response.data 
        : response;

      if (actualData?.pdfUrl) {
        return actualData.pdfUrl;
      }
      
      // If pdfUrl is a direct string or token URL
      if (typeof actualData === 'string' && (actualData.startsWith('http') || actualData.startsWith('/'))) {
        return actualData;
      }

      return null;
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to generate preview link";
      set({ error: errMsg });
      return null;
    }
  },

  approveVersion: async (versionId: string, cvId: string) => {
    try {
      const response: any = await approveMedicalCvVersion(versionId);
      const isFailed = typeof response === 'object' && response !== null && 'success' in response && response.success === false;
      
      if (isFailed) {
        set({ error: response.message || "Failed to approve CV version" });
        return false;
      }

      // Refresh details after approval
      await get().fetchCvDetails(cvId);
      return true;
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to approve CV version";
      set({ error: errMsg });
      return false;
    }
  },
}));
