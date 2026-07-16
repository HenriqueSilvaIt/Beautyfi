import { create } from "zustand";

interface PreferencesStore {
  showInAppNewAppointmentModal: boolean;
  setShowInAppNewAppointmentModal: (value: boolean) => void;
  showAllEmployeeDashboardsToEmployees: boolean;
  setShowAllEmployeeDashboardsToEmployees: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  showInAppNewAppointmentModal: true,
  setShowInAppNewAppointmentModal: (value) => set({ showInAppNewAppointmentModal: value }),
  showAllEmployeeDashboardsToEmployees: false,
  setShowAllEmployeeDashboardsToEmployees: (value) => set({ showAllEmployeeDashboardsToEmployees: value }),
}));
