import { create } from "zustand";
import { PatientMedicalCv } from "@/types/medical-cv";
import { getPatientMedicalCvs, createPatientMedicalCv } from "@/lib/api/medical-cvs";

export type PatientMedicalCvsState = {
  cvs: PatientMedicalCv[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  patientId: string | null;
  
  setPatientId: (patientId: string) => void;
  fetchCvs: (patientId?: string) => Promise<void>;
  createCv: (title: string, patientId?: string) => Promise<boolean>;
  clearError: () => void;
};

export const usePatientMedicalCvsStore = create<PatientMedicalCvsState>((set, get) => ({
  cvs: [],
  isLoading: false,
  isCreating: false,
  error: null,
  patientId: null,

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

      // The backend might return the array directly or wrap it in an ApiResponse
      const isArray = Array.isArray(response);
      const actualData = isArray ? response : response.data;
      const isSuccess = isArray ? true : response.success;

      if (isSuccess) {
        set({
          cvs: actualData || [],
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

  createCv: async (title: string, passedPatientId?: string) => {
    const patientId = passedPatientId || get().patientId;
    if (!patientId) {
      set({ error: "Patient ID is required to create a CV" });
      return false;
    }

    set({ isCreating: true, error: null });
    try {
      const response = await createPatientMedicalCv(patientId, { title });
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
}));
