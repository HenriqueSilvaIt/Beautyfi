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
        set((state) => {
          const newUser = typeof value === "function" ? value(state.user) : value;
          if (newUser?.companyId) {
            import("./company-store").then(({ useCompanyStore }) => {
              useCompanyStore.getState().setSelectedCompanyId(newUser.companyId!);
            }).catch(() => {});
          }
          return { user: newUser };
        }),
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
          authReady: false,
          hasHydrated: true,
        });
        import("./company-store").then(({ useCompanyStore }) => {
          useCompanyStore.getState().resetCompanyStore();
          useCompanyStore.persist?.clearStorage?.();
        }).catch(() => {});
        import("./address-store").then(({ useAddressStore }) => {
          useAddressStore.getState().clearAddress();
          useAddressStore.persist?.clearStorage?.();
        }).catch(() => {});
        AsyncStorage.multiRemove([
          "style-auth",
          "style-company",
          "beautyfi-address-store",
        ]).catch(() => {});
      },
      hasHydrated: false,
      setHasHydated: (value) => set({ hasHydrated: value }),
    }),

    {
      name: "style-auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydated(true);
        if (state?.user?.companyId) {
          import("./company-store").then(({ useCompanyStore }) => {
            useCompanyStore.getState().setSelectedCompanyId(state.user.companyId!);
          }).catch(() => {});
        }
      },
    },
  ),
);
