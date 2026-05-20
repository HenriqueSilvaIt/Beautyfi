import * as yup from "yup";

export const serviceScheme = yup.object({
  name: yup.string().required("Nome do serviço é obrigatório"),
  price: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").required("É obrigatório informar o preço"),
  commissionServiceFee: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").optional(),
  description: yup.string().optional(),
  priceDescription: yup.string().optional().nullable(),
  imgUrl: yup.string().optional(),
  duration: yup.string().required(),  
  employees: yup
      .array()
      .of(
        yup.object({
          id: yup.number().required("Necessário o id do serviço").optional(),
        }),
      )
      .optional(),
});





export type ServiceFormData = yup.InferType<typeof serviceScheme>;
