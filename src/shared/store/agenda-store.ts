import { create } from "zustand";
import { EmployeeInterface, EmployeeProps, EmployeeWorkDays, EmployeeWorkTimes } from "../interfaces/http/employee";
import { ClientInterface } from "../interfaces/http/client";
import { CompanyServicesInterface } from "../interfaces/http/company-services";
import { useUserStore } from "./user-store";

type AgendaState = {
  selectedDay: Date;
  selectedDayBlockStart: Date;
  selectedDayBlockEnd: Date;
  time: string | null;
  setDay: (day: Date) => void;
  setDayBlockStart: (day: Date) => void;
  setDayBlockEnd: (day: Date) => void;
  setTime: (time: string) => void;
  employee: EmployeeProps;
  setEmployee: (employee: EmployeeProps) => void;
  clientId?: number;
  setClientId: (id: number | undefined) => void;
  client?: ClientInterface;
  setClient: (client?: ClientInterface) => void;
  service?: CompanyServicesInterface;
  setService: (service?: CompanyServicesInterface) => void;
  isBooking: boolean;
  setIsBooking: (booking: boolean) => void;
  serviceId?: number;
  setServiceId: (id: number) => void;
  employeeId?: number | null;
  setEmployeeId: (id?: number | null) => void;
  additionalInfo: string;
  setAddionalInfo: (value: string) => void;
  fitIn: boolean;
  setFitIn: (value: boolean) => void;
  employeeTimes: EmployeeWorkDays[]
  setEmployeeTimes: (list: EmployeeWorkDays[]) => void
};



export const useAgendaStore = create<AgendaState>((set) => {
return {
  selectedDay: new Date(),
  selectedDayBlockStart: new Date(),
  selectedDayBlockEnd: new Date(),
  time: null,
  clientId: 1,
  serviceId: undefined,
  isBooking: false,
  client: undefined,
  employeeTimes: [],
  employeeId:null,
  service: undefined,
  setDay: (day) => set({ selectedDay: day }),
  setDayBlockStart: (day) => set({ selectedDayBlockStart: day }),
  setDayBlockEnd: (day) => set({ selectedDayBlockEnd: day }),
  setTime: (time) => set({ time: time }),
  employee: {
    id: 0,
    name: "",
    email: "",
    password: "",
    description: "",
    phone: "",
    comissionRate: 0,
    avatarUrl: "",
    firstTime: "00:00:00",
    secondTime: "00:00:00",
    thirdTime: "00:00:00",
    lastTime: "00:00:00",
  },
  additionalInfo: "",
  setAddionalInfo: (value) => set({additionalInfo: value}),
  setClient: (client) => set({ client: client }),
  setClientId: (clientId) => set({ clientId: clientId }),
  setIsBooking: (isBooking) => set({ isBooking: isBooking }),
  setService: (service) => set({ service: service }),
  setServiceId: (serviceId) => set({ serviceId: serviceId }),
  setEmployee: (employeee) => set({ employee: employeee }),
  setEmployeeId: (employeeId) => set({ employeeId }),
  fitIn: false,
  setFitIn: (value: boolean) => set((state) => ({ fitIn: value })),
  setEmployeeTimes: (list) => set(({employeeTimes: list}))
}
});
