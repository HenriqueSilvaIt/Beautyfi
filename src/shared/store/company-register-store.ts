import { create } from "zustand";

export interface InitialServiceItem {
  name: string;
  price: number;
  duration: number;
}

export interface InitialClientItem {
  name: string;
  phone: string;
  email: string;
}

export interface InitialEmployeeItem {
  name: string;
  phone: string;
  email: string;
  password?: string;
}

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
  // Página 5: Serviços Reais
  defaultServices: string[];
  realServices: InitialServiceItem[];
  // Página 6: Clientes Iniciais (Opcional)
  clients: InitialClientItem[];
  // Página 7: Equipe / Profissionais (Opcional)
  employees: InitialEmployeeItem[];
  // Página 8: Horários de Trabalho
  workDays: string[];
  scheduleStart: string;
  scheduleLunchStart: string;
  scheduleLunchEnd: string;
  scheduleEnd: string;
  // Página 9: Imagens do Espaço e Portfólio (Opcional)
  imagesUrl: string[];
  portfolioImagesUrl?: string[];
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
    realServices: [],
    clients: [],
    employees: [],
    workDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    scheduleStart: "09:00",
    scheduleLunchStart: "12:00",
    scheduleLunchEnd: "13:00",
    scheduleEnd: "18:00",
    imagesUrl: [],
    portfolioImagesUrl: [],
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
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 10) })),
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
        realServices: [],
        clients: [],
        employees: [],
        workDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
        scheduleStart: "09:00",
        scheduleLunchStart: "12:00",
        scheduleLunchEnd: "13:00",
        scheduleEnd: "18:00",
        imagesUrl: [],
        portfolioImagesUrl: [],
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
