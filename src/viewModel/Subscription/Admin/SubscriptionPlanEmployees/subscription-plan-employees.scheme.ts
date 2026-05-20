import * as yup from "yup";

export const employeePlanScheme = yup.object({
  employeeIds: yup
    .array()
    .of(yup.number().required("Necessário o id do funcionário"))
    .optional(),
});

export type SubscriptionPlanEmployeeFormData = yup.InferType<
  typeof employeePlanScheme
>;
