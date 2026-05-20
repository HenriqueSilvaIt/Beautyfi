import * as yup from "yup" ;

export const subscriptionAdminSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Descrição é obrigatória"),  
    amount: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").required("É obrigatório informar o preço"),  
    cutsAllowed: yup.string().required("Quatidade é obrigatória").matches(/^\d+$/, "Cuts Allowed must be a positive integer"),
    commissionPercentage: yup.string().min(0, "O valor deve ser maior que  R$ 0.0").optional(),  
    company: yup.number().nullable(),
  });

  export type SubscriptionAdminFormData = yup.InferType<typeof subscriptionAdminSchema>;