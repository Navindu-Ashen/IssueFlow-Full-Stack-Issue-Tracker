import { create } from "zustand";
import type { User } from "@/types";
import * as authService from "@/services/authService";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  initializeAuth: async () => {
    if (get().isAuthenticated) {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await authService.refreshTokens();
      set({ user: res.user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
