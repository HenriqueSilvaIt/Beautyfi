import * as yup from "yup";

export const employeeServicesScheme = yup.object({
  id: yup.number().optional(),
  employeeId: yup.number().required(),
  serviceId: yup.number().required(),
  customPrice: yup.mixed().optional(),
  customDuration: yup.mixed().optional(),
  customCommission: yup.mixed().optional(),
  dayPrices: yup.array().of(
    yup.object({
      dayWeek: yup.string().required(),
      customPrice: yup.mixed().optional(),
      customCommission: yup.mixed().optional(),
    })
  ).optional(),
});

export type EmployeeServicesFormData = yup.InferType<
  typeof employeeServicesScheme
>;
