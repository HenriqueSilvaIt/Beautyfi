import * as yup from "yup";

export const serviceScheme = yup.object({
  name: yup.string().required("Nome do serviço é obrigatório"),
  price: yup.string().required("É obrigatório informar o preço"),
  commissionServiceFee: yup.string().optional().nullable(),
  description: yup.string().optional().nullable(),
  priceDescription: yup.string().optional().nullable(),
  priceStartingFrom: yup.boolean().optional(),
  imgUrl: yup.string().optional().nullable(),
  requiresDeposit: yup.boolean().optional(),
  depositType: yup.string().optional().nullable(),
  depositAmount: yup.string().optional().nullable(),
  noShowFee: yup.string().optional().nullable(),
  duration: yup.string().optional().nullable(),  
  employees: yup
      .array()
      .of(
        yup.object({
          id: yup.number().optional(),
        }),
      )
      .optional().nullable(),
});





export type ServiceFormData = yup.InferType<typeof serviceScheme>;
