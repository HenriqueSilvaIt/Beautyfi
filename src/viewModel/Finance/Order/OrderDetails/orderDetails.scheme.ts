import * as yup from "yup";

export const orderDetailsScheme = yup.object({
  discount: yup.number().optional(),
  total: yup.number().optional(),
  tip: yup.number().optional(),
});

export type OrderDetailsFormData = yup.InferType<typeof orderDetailsScheme>;
