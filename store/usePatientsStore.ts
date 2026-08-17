import { create } from "zustand";
import { PatientAccessSession } from "@/lib/api/patients";

export type PatientsState = {
  patients: PatientAccessSession[];
  setPatients: (patients: PatientAccessSession[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  page: number;
  setPage: (page: number) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  hasNextPage: boolean;
  setHasNextPage: (hasNextPage: boolean) => void;
  totalCount: number | null;
  setTotalCount: (totalCount: number | null) => void;
};

export const usePatientsStore = create<PatientsState>((set) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  page: 1,
  setPage: (page) => set({ page }),
  statusFilter: "Active",
  setStatusFilter: (status) => set({ statusFilter: status, page: 1 }),
  hasNextPage: false,
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),
  totalCount: null,
  setTotalCount: (totalCount) => set({ totalCount }),
}));
