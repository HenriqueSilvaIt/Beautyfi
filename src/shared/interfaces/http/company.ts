

export interface OpeningHourProps{

    id: number
    firstHour: Date
    secondHour: Date
    thirdHour: Date
    lastHour: Date
    dayWeek: string
    companyId: number
}

export interface PaymentMethodDTOS {
    id: number
    name: string
    companyId: number
}

export interface SocialMediaDTOS {

    id: number
    name: string
    mediaUrl: string
    icon: string
    companyid: string
}

export interface CompanyInterface {

   id?: number;
   name: string,
   description?: string
   cnpj?: string
   logoUrl?: string
   address: string
   phone: string


}

export interface CompanyProps {

   id: number
   name: string,
   description: string
   cnpj: string
   logoUrl: string
   address: string
   phone: string
   openingHourDTOS: OpeningHourProps[]
   socialMediaDTOS: SocialMediaDTOS[]
   paymentMethodDTOS: PaymentMethodDTOS[]

}



export interface CompanyHttpResponse {

    content: CompanyProps[]
    totalRows: number
    totalPerPage: number
    page: number
    perPage: number

}