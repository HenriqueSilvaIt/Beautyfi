import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PackageProps {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
  imgUrl?: string;
  servicesIncluded?: string;
  active?: boolean;
}

export interface PackageStore {
  packages: PackageProps[];
  addPackage: (data: Omit<PackageProps, "id">) => void;
  updatePackage: (id: number, data: Partial<PackageProps>) => void;
  deletePackage: (id: number) => void;
}

export const usePackageStore = create<PackageStore>()(
  persist(
    (set) => ({
      packages: [
        {
          id: 1,
          name: "Combo Corte + Barba Premium",
          price: "80,00",
          duration: "60",
          description: "Inclui corte de cabelo moderno, barba completa com toalha quente e finalização com pomada.",
          servicesIncluded: "Corte, Barba",
          imgUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300",
          active: true
        },
        {
          id: 2,
          name: "Pacote 4 Cortes Mensais",
          price: "150,00",
          duration: "45",
          description: "Garante 4 cortes de cabelo no mês com preço especial.",
          servicesIncluded: "Corte de Cabelo",
          imgUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300",
          active: true
        }
      ],
      addPackage: (data) =>
        set((state) => ({
          packages: [
            ...state.packages,
            {
              id: Date.now(),
              ...data,
              active: true
            }
          ]
        })),
      updatePackage: (id, data) =>
        set((state) => ({
          packages: state.packages.map((pkg) =>
            pkg.id === id ? { ...pkg, ...data } : pkg
          )
        })),
      deletePackage: (id) =>
        set((state) => ({
          packages: state.packages.filter((pkg) => pkg.id !== id)
        }))
    }),
    {
      name: "beautyfi-packages",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
