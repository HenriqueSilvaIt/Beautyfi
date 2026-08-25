import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CompanyStore {
  selectedCompanyId: number | null;
  setSelectedCompanyId: (id: number | null) => void;
  favoritedCompanyIds: number[];
  setFavoritedCompanyIds: (ids: number[]) => void;
  addFavoriteId: (id: number) => void;
  removeFavoriteId: (id: number) => void;
  resetCompanyStore: () => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      selectedCompanyId: null,
      setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
      favoritedCompanyIds: [],
      setFavoritedCompanyIds: (ids) => set({ favoritedCompanyIds: ids }),
      addFavoriteId: (id) =>
        set((state) => ({
          favoritedCompanyIds: state.favoritedCompanyIds.includes(id)
            ? state.favoritedCompanyIds
            : [...state.favoritedCompanyIds, id],
        })),
      removeFavoriteId: (id) =>
        set((state) => ({
          favoritedCompanyIds: state.favoritedCompanyIds.filter((x) => x !== id),
        })),
      resetCompanyStore: () =>
        set({ selectedCompanyId: null, favoritedCompanyIds: [] }),
    }),
    {
      name: "style-company",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
