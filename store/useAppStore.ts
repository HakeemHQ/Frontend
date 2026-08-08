import { create } from "zustand";

export type SupportedLocale = "en" | "ar";

export type AppState = {
  locale: SupportedLocale;
  accessToken: string | null;
  profileLoaded: boolean;
  isSidebarCollapsed: boolean;
  setLocale: (locale: SupportedLocale) => void;
  setAccessToken: (token: string | null) => void;
  setProfileLoaded: (loaded: boolean) => void;
  toggleSidebar: () => void;
  reset: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  locale: "en",
  accessToken: null,
  profileLoaded: false,
  isSidebarCollapsed: false,
  setLocale(locale) {
    set({ locale });
  },
  setAccessToken(token) {
    set({ accessToken: token });
  },
  setProfileLoaded(loaded) {
    set({ profileLoaded: loaded });
  },
  toggleSidebar() {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },
  reset() {
    set({
      locale: "en",
      accessToken: null,
      profileLoaded: false,
      isSidebarCollapsed: false,
    });
  },
}));
