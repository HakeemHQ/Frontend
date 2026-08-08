import { create } from "zustand";

export type ProfileState = {
  profile: null | {
    name: string;
    email?: string;
  };
  setProfile: (profile: { name: string; email?: string } | null) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile(profile) {
    set({ profile });
  },
}));
