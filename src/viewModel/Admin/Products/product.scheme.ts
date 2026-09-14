import * as yup from "yup";

export const productSchema = yup.object({

      name: yup.string().required("Nome do produto é obrigatório"),
      description: yup.string().optional(),
      price: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").required("É obrigatório informar o preço"),
      commission: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").optional(),
      quantity: yup.string().optional(),
      imgUrl: yup.string().optional(),
      barCode: yup.string().optional(),
      priceStartingFrom: yup.boolean().optional(),
})

export type ProductFormData = yup.InferType<typeof productSchema>;