import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SettingsStore {
  allowInAppNewAppointmentModal: boolean;
  setAllowInAppNewAppointmentModal: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      allowInAppNewAppointmentModal: true,
      setAllowInAppNewAppointmentModal: (value) => set({ allowInAppNewAppointmentModal: value }),
    }),
    {
      name: "beautyfi-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
