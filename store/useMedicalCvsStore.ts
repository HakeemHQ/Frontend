import { create } from "zustand";
import { MedicalCv } from "@/types/medical-cv";
import { getMedicalCvs, createMedicalCv, CreateMedicalCvParams } from "@/lib/api/medical-cvs";

export type MedicalCvsState = {
  cvs: MedicalCv[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchQuery: string;
  
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  fetchCvs: () => Promise<void>;
  createCv: (params: CreateMedicalCvParams) => Promise<boolean>;
};

export const useMedicalCvsStore = create<MedicalCvsState>((set, get) => ({
  cvs: [],
  isLoading: false,
  isCreating: false,
  error: null,
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  searchQuery: "",

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1 });
    get().fetchCvs();
  },
  
  setPage: (page) => {
    set({ page });
    get().fetchCvs();
  },

  fetchCvs: async () => {
    const { page, pageSize, searchQuery } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await getMedicalCvs({
        Page: page,
        PageSize: pageSize,
        Search: searchQuery || undefined,
      });

      if (response.success) {
        set({
          cvs: response.data.items,
          totalItems: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
          isLoading: false,
        });
      } else {
        set({ error: response.message || "Failed to fetch CVs", isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isLoading: false 
      });
    }
  },

  createCv: async (params) => {
    set({ isCreating: true, error: null });
    try {
      const response = await createMedicalCv(params);
      if (response.success) {
        // Optionally refresh or prepend the new CV
        set((state) => ({ 
          isCreating: false,
          // Since the API returns the created object, we could just unshift it, 
          // or just refetch. Let's just refetch for simplicity and correctness.
        }));
        await get().fetchCvs();
        return true;
      } else {
        set({ error: response.message || "Failed to create CV", isCreating: false });
        return false;
      }
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || "An unexpected error occurred", 
        isCreating: false 
      });
      return false;
    }
  }
}));
