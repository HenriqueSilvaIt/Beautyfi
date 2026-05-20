import * as yup from "yup"

export const updateProductItemScheme = yup.object({
      price: yup.string().optional(),

      
})

export type UpdateProductItemFormData = yup.InferType<typeof updateProductItemScheme>