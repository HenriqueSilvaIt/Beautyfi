import { AppError } from "../helpers/AppError";
import { useSnackbarContext } from "./snackbar.context";

/*Hook para formatar a mensagem de erro e exibir a snackbar */
export function useErrorHandler() {

    /*Notify é responsavel por exibir nossa snackbar */
    const {notify} = useSnackbarContext();

    /*Vamaos passar o erro e uma default message para essa função 
    e vamos validar se é um isAppError (ou seja um erro renhecido do backend) ose n 
    vai ser  amensagem padrão e mostrar o snackbar através do notify*/
    function handleError (error: unknown, defaultMessage?: string) {

        const isAppError = error instanceof AppError;/** toda vez que o axios
            retorna algum erro ele sempre vai ser uma instancia de AppErro a classe que criamos
            para capturar erro do backend
            
               response.data é o retorno da api
                         response.data.content é quando tem lista*/

        const message = isAppError ? error.message : defaultMessage ?? "Falha na requisição"


        notify({
            message,
            type: "ERROR",
        })

    };

    return  {
        handleError
    }
    /*Toda vez que tivermos algum tipo de requisição assíncrona dentro do código
     (onde haja necessidade de colocarmos um try catch) ao invés de ficarmos 
     fazendo tratamento da mensagem com if para verificar se é um erro conhedido do backend
     , usamos esse handleError*/
    
}