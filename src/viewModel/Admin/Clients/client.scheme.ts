import * as yup from "yup";

export const clientScheme = yup.object({
  name: yup.string().required("Nome do cliente é obrigatório"),
  birthDate: yup
    .string()
    .optional()
    .nullable()
    .test("valid-date", "Data inválida (use DD/MM/AAAA)", (value) => {
      if (!value || value.trim() === "") return true;

      const [d, m, y] = value.split("/").map(Number);
      if (!d || !m || !y) return false;
      const date = new Date(y, m - 1, d);

      return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      );
    }),
  email: yup
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === "" ? undefined : v))
    .email("E-mail inválido"),
  profileUrl: yup.string().optional().nullable(),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .test("valid-phone", "Telefone inválido. Digite DDD + Número (ex: 11 99999-9999)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }),
  allergies: yup.string().optional().nullable(),
  skinHairType: yup.string().optional().nullable(),
  preExistingConditions: yup.string().optional().nullable(),
  medications: yup.string().optional().nullable(),
  observations: yup.string().optional().nullable(),
});

export type ClientFormData = yup.InferType<typeof clientScheme>;
