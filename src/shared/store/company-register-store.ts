import { create } from "zustand";

export interface CompanyRegisterData {
  // Página 1: Dados do Admin e Empresa
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  name: string;
  subdomain: string;
  // Página 2
  categories: string[];
  // Página 3
  teamSize: "1" | "2-5" | "6-10" | "11-20" | "20+";
  // Página 4: Endereço Detalhado
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  // Página 5
  defaultServices: string[];
  defaultProducts: string[];
  // Página 6
  imagesUrl: string[];
  logoUrl?: string;
}

interface CompanyRegisterState {
  step: number;
  data: Partial<CompanyRegisterData>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (fields: Partial<CompanyRegisterData>) => void;
  reset: () => void;
}

export const useCompanyRegisterStore = create<CompanyRegisterState>((set) => ({
  step: 1,
  data: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    name: "",
    subdomain: "",
    categories: [],
    defaultServices: [],
    defaultProducts: [],
    imagesUrl: [],
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    address: "",
  },
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 6) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  updateData: (fields) => set((s) => ({ data: { ...s.data, ...fields } })),
  reset: () =>
    set({
      step: 1,
      data: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        name: "",
        subdomain: "",
        categories: [],
        defaultServices: [],
        defaultProducts: [],
        imagesUrl: [],
        cep: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        complement: "",
        address: "",
      },
    }),
}));
