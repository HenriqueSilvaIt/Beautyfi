import * as yup from "yup";

export const newProductItemScheme = yup.object({
  price: yup.string().optional(),
});

export type NewProductItemFormData = yup.InferType<typeof newProductItemScheme>;
