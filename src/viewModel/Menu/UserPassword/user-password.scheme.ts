import * as yup from "yup";

export const userPasswordScheme = yup.object({
  currentPassword: yup.string().required("Senha atual é obrigatória"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: yup
    .string()
    .required("Senha é obrigatória")
    .oneOf([yup.ref("password")], "Senhas não conhecidem"),
  /*oneOf recebe o password  e compara os valores */
});

export type UserPasswordFormData = yup.InferType<typeof userPasswordScheme>;
