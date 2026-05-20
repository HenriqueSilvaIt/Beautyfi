import { getPaymentCardFlag, getPaymentMethods } from "@/shared/services/payment.service";
import { useMutation } from "@tanstack/react-query";


export function usePaymentMutation() {


    const getPaymentMethodMutation = useMutation({
        mutationFn: () => getPaymentMethods(),
        onSuccess:() => {

        },
        onError:(error) => {
            console.log(error)
        }
    })

     const getPaymentCardFlagMutation = useMutation({
        mutationFn: () => getPaymentCardFlag(),
        onSuccess:() => {

        },
        onError:(error) => {
            console.log(error)
        }
    })

    return{
        getPaymentMethodMutation,
        getPaymentCardFlagMutation
    }
}