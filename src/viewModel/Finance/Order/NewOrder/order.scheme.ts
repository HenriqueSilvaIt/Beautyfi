import * as yup from "yup";

export const orderScheme = yup.object({
      additionalInfo: yup.string().optional(),
      orderNumber: yup.string().max(10).min(10).optional(),

})

export type OrderFormData = yup.InferType<typeof orderScheme>