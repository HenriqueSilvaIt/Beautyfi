import * as yup from "yup";

export const packageScheme = yup.object({
  name: yup.string().required("Nome do pacote é obrigatório"),
  price: yup.string().required("É obrigatório informar o preço"),
  description: yup.string().optional(),
  imgUrl: yup.string().optional(),
  duration: yup.string().required("Duração é obrigatória"),
  servicesIncluded: yup.string().optional(),
});

export type PackageFormData = yup.InferType<typeof packageScheme>;
