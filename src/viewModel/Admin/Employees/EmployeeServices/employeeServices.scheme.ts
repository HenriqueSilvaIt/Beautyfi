import * as yup from "yup";

export const employeeServicesScheme = yup.object({
  id: yup.number().optional(),
  employeeId: yup.number().required(),
  serviceId: yup.number().required(),
  customPrice: yup.number().nullable().optional(),
  customDuration: yup.number().nullable().optional(),
  customCommission: yup.number().nullable().optional(),
  dayPrices: yup.array().of(
    yup.object({
      dayWeek: yup.string().required(),
      customPrice: yup.number().nullable().optional(),
      customCommission: yup.number().nullable().optional(),
    })
  ).optional(),
});


export type EmployeeServicesFormData = yup.InferType<
  typeof employeeServicesScheme
>;
