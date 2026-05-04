import type { User } from "@/lib/api-endpoints";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAccessToken: (token: string | null) => void;
  setInitialized: (status: boolean) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),
  setInitialized: (status) => set({ isInitialized: status }),
  logout: () => set({ accessToken: null, isAuthenticated: false }),
  setUser: (user) => set({ user }),
  clearAuth: () =>
    set({ accessToken: null, isAuthenticated: false, user: null }),
}));
