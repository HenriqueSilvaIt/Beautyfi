import * as yup from "yup";

export const registerScheme = yup.object({
  firstName: yup
    .string()
    .required("Nome é obrigatório")
    .min(4, "Nome deve ter pelo menos 4 caracteres"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Telefone inválido. Use (99) 99999-9999",
    ),
  companyId: yup.number().required("Id da empreasa é obrigatório."),
});

export type RegisterFormData = yup.InferType<typeof registerScheme>;
