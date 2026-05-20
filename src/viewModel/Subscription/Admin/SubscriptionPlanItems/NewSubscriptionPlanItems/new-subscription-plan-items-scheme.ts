import { EDayWeek } from "@/shared/interfaces/http/employee";
import * as yup from "yup";
export const newSubscriptionPlanItemsScheme = yup.object({
  discountPercentage: yup
    .string()
    .min(0, "O valor deve ser maior que  R$ 0.0")
    .optional(),
  cutsAllowed: yup
    .string()
    .optional()
    .matches(/^\d+$/, "Cuts Allowed must be a positive integer"),
  weekDays: yup
    .array()
    .of(
      yup
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
        .required(),
    )
    .optional(),
});

export type NewSubscriptionPlanItemsFormData = yup.InferType<
  typeof newSubscriptionPlanItemsScheme
>;
