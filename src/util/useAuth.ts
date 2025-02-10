import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

function getInitialToken() {
  console.log("intial", localStorage.getItem("token") ?? null);
  return localStorage.getItem("token") ?? null;
}

export const useAuth = create<AuthState, [["zustand/persist", unknown]]>(
  persist(
    (set, _get) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
