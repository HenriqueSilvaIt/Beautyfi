import * as yup from "yup"

export const passwordRecoverScheme = yup.object({
    email: yup.string().email("Email inválido").required("Email é obrigatório")
})

export type  PasswordRecoverFormData =  yup.InferType<typeof passwordRecoverScheme>