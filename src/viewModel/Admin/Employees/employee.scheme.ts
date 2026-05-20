import { EDayWeek } from "@/shared/interfaces/http/employee";
import * as yup from "yup";

export const employeeScheme = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Nome do profissional é obrigátório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().optional().nullable().transform((value) => (value === "" ? null : value)) ,
  description: yup.string().optional(),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Telefone inválido. Use (99) 99999-9999",
    ),
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
