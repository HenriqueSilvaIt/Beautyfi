import * as yup from "yup";

export const companyScheme = yup.object({
  name: yup.string().required("Nome da empresa é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  description: yup.string().optional(),
  cnpj: yup.string().optional(),
  logoUrl: yup.string().optional(),
  phone: yup.string().required("Telefone é obrigatória").matches(/^\d{11}$/, 'Telefone deve ter 11 dígitos (DDD + número)')
  
});

export type CompanyFormData = yup.InferType<typeof companyScheme>;
