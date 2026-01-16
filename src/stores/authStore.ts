import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserType } from "@/types/Auth";

type AuthStoreType = {
  accessToken: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserType) => void;
  clearAuth: () => void;
};

const STORAGE_KEY = "auth-storage";

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token: string, user: UserType) => {
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
