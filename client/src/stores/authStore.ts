import { create } from "zustand";
import type { User } from "@/lib/api-endpoints";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;

  setAuth: (data: { user: User; accessToken: string }) => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  clear: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,

  setAuth: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
    }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clear: () =>
    set({
      user: null,
      accessToken: null,
    }),

  setInitialized: (value) => set({ isInitialized: value }),
}));
