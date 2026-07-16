import * as yup from "yup";

export const googleSignUpScheme = yup.object({
  name: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),

  phone: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test("phone-format", "Telefone inválido. Use (99) 99999-9999", (value) => {
      if (!value) return true; 
      return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value);
    }),

 birthDate: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)) // ✅ "" vira null
    .test("valid-date", "Data inválida", (value) => {
      if (!value) return true; // ✅ null/undefined passa
      const [d, m, y] = value.split("/").map(Number);
      const date = new Date(y, m - 1, d);
      return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      );
    }),
});

export type GoogleSignUpFormData = yup.InferType<typeof googleSignUpScheme>;
