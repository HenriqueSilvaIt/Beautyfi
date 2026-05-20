import { create } from "zustand";
import { OrderInterface } from "../interfaces/http/order";
import { CompanyServicesProps } from "../interfaces/http/company-services";
import { EmployeeProps } from "../interfaces/http/employee";
import { ProductProps } from "../interfaces/http/product";

interface OrderState {
  order: Partial<OrderInterface>;
  setOrder: (order: Partial<OrderInterface>) => void;
  resetOrder: () => void;
  serviceItemDate?: Date;
  setServiceItemDate: (serviceItemDate?: Date) => void;
  productItemId?: number;
  setProductItemId: (productItemId?: number) => void;
  product?: ProductProps;
  setProduct: (product?: ProductProps) => void;
  serviceItemId?: number;
  setServiceItemId: (serviceItemId?: number) => void;
  service?: CompanyServicesProps;
  setService: (service?: CompanyServicesProps) => void;
  employeeItemId?: number;
  setEmployeeItemid: (employeeItemId?: number) => void;
  orderItemId?: number;
  setOrderItemId?: (orderItemId?: number) => void;
  employee?: EmployeeProps;
  setEmployee: (employee?: EmployeeProps) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  order: {
    moment: "",
    additionalInfo: "",
    employeeId: 0,
    isEmployee: false,
    user: undefined,
    employee: undefined,
  },
  orderItemId: undefined,
  setOrderItemId: (orderItemId?: number) => set({orderItemId: orderItemId}),
  serviceItemId: undefined,
  setServiceItemId: (service?: number) => set({ serviceItemId: service }),
  service: undefined,
  setService: (data?: CompanyServicesProps) => set({ service: data }),
  productItemId: undefined,
  setProductItemId: (product?: number) => set({productItemId: product}),
  product: undefined,
  setProduct: (data?: ProductProps) => set({product: data}),
  employee: undefined,
  setEmployee: (data?: EmployeeProps) => set({ employee: data }),
  serviceItemDate: new Date(),
  setServiceItemDate: (date?: Date) => set({ serviceItemDate: date }),
  employeeItemId: undefined,
  setEmployeeItemid: (employee?: number) => set({ employeeItemId: employee }),
  setOrder: (order) => set({ order }),
  resetOrder: () =>
    set({
      order: {
        moment: "",
        additionalInfo: "",
        employeeId: 0,
        isEmployee: false,
        user: undefined,
        employee: undefined,
      },
    }),
}));
