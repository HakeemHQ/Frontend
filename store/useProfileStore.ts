import { create } from "zustand";
import { DoctorProfile } from "@/lib/api/profile";

export type ProfileState = {
  profile: null | {
    name: string;
    email?: string;
  } | DoctorProfile;
  setProfile: (profile: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
}));
