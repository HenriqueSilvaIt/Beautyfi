import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProps } from "../interfaces/user";
import { LoginHttpResponse } from "../interfaces/http/login";

interface UpdateTokensParams {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserStore {
  user: UserProps | null;

  access_token: string | null;
  token_type: string | null;
  expires_in: number | null;
  hasHydrated: boolean;
  authReady: boolean;
  setAuthReady: (authReady: boolean) => void;
  setHasHydated: (value: boolean) => void;
  setSession: (sessionData: LoginHttpResponse) => void;
  setUser: (
    user: UserProps | ((prev: UserProps | null) => UserProps | null),
  ) => void;
  updateTokens: (data: UpdateTokensParams) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      token_type: null,
      expires_in: null,
      setSession: (sessionData) => {
        set({
          access_token: sessionData.access_token,
          token_type: sessionData.token_type,
          expires_in: sessionData.expires_in,
        });
      },
      setUser: (value) =>
        set((state) => ({
          user: typeof value === "function" ? value(state.user) : value,
        })),
      updateTokens: (data) => {
        set({
          access_token: data.access_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
        });
      },
  authReady: false,
setAuthReady: (value: boolean) => set({ authReady: value }),
      logout: () => {
        set({
          user: null,
          access_token: null,
          token_type: null,
          expires_in: null,
        });
      },
      hasHydrated: false,
      setHasHydated: (value) => set({ hasHydrated: value }),
    }),

    {
      name: "style-auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydated(true);
      },
    },
  ),
);
