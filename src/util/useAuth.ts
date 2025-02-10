import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState, [["zustand/persist", unknown]]>(
  persist(
    (get, set) => ({
      token: null,
      setToken: (token) => (set().token = token),
      logout: () => (set().token = null),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
