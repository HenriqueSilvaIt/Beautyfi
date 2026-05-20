import * as yup from "yup";

export const userScheme = yup.object({
  firstName: yup.string().required(),
  avatarUrl: yup.string().optional(),
  birthDate: yup
    .string()
    .optional()
    .test("valid-date", "Data inválida", (value) => {
      if (!value) return true;

      const [d, m, y] = value.split("/").map(Number);
      const date = new Date(y, m - 1, d);

      return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      );
    }),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Telefone inválido. Use (99) 99999-9999"
    ),
});

export type UserFormData = yup.InferType<typeof userScheme>;
