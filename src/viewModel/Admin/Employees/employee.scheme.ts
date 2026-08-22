import { EDayWeek } from "@/shared/interfaces/http/employee";
import * as yup from "yup";

export const employeeScheme = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Nome do profissional é obrigátório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => (!value || value.trim() === "" ? undefined : value)),
  description: yup.string().optional(),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .test("valid-phone", "Telefone inválido. Use (99) 99999-9999", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }),
  avatarUrl: yup.string().optional(),
  schedule: yup
    .array()
    .of(
      yup.object({
        day: yup
          .mixed<EDayWeek>()
          .oneOf([
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
            "Domingo",
          ])
          .required("Dia obrigatório"),

        times: yup
          .array()
          .of(
            yup.object({
              start: yup.string().required("Hora inicial obrigatória"),
              end: yup.string().required("Hora final obrigatória"),
            }),
          )
          .min(1, "Adicione pelo menos um período")
          .required("Horários obrigatórios"),
      }),
    )
    .optional(),
  services: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required("Necessário o id do serviço").optional(),
      }),
    )
    .optional(),
});

export type EmployeeFormData = yup.InferType<typeof employeeScheme>;
