import * as yup from "yup";

export const advertisementScheme = yup.object({

    title: yup.string().optional(),
    description: yup.string().optional(),
    imgUrl: yup.string().optional(),
    url: yup.string().optional()

})

export type AdvertisementFormData = yup.InferType<typeof advertisementScheme>