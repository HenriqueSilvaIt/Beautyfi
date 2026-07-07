import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AddressState {
  addressText: string;
  latitude: number | null;
  longitude: number | null;
  setAddress: (addressText: string, latitude: number | null, longitude: number | null) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addressText: "",
      latitude: null,
      longitude: null,
      setAddress: (addressText, latitude, longitude) =>
        set({ addressText, latitude, longitude }),
      clearAddress: () =>
        set({ addressText: "", latitude: null, longitude: null }),
    }),
    {
      name: "beautyfi-address-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
