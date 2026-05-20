import { createContext, PropsWithChildren, useContext, useState } from "react";

/*qual tipo de menssagem queremos receber no nossa sanck bar  */
export type SnackbarMessageType = "ERROR" | "SUCCESS" | "WARNING";

/*Parâmetros do notify*/
interface NotifyMessageParams {
    message: string | null;
    type: SnackbarMessageType;
    time?: number
}

/*Parâmetros gerais do snackbar */
export type SnackBarContextType = {
    message: string | null;
    type: SnackbarMessageType | null
    notify: (params: NotifyMessageParams ) => void;
}

/*Esse vai ser o nosso contexto, vamos usar o createContext  do react */
const SnackBarContext = createContext( {} as SnackBarContextType);


/*Provider onde vamos englobar toda aplicação, ele recebe um children como um parâmetro
toda aplicação é recebida como parâmetro dentro do nosso contexto*/
export function SnackbarContextProvider({children}: PropsWithChildren) {

    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<SnackbarMessageType | null>(null);

     function notify({message, type, time} : NotifyMessageParams) {
        setMessage(message);
        setType(type);
        /*Tempo para snack bar ficar mostrando a mensagem de erro */
        if (time) {
            setTimeout(() => {

            setMessage(null);
            setType(null);
        }, time )
        } else {
        setTimeout(() => {

            setMessage(null);
            setType(null);
        },
        3000 /*executa a função acima depois e 3 segundo 
        ou seja executa a  snackbar e remove depois*/)
    }
    }

    return (
        <SnackBarContext.Provider
            value={{
                message,
                type,
                notify,
            }}>{children}</SnackBarContext.Provider>
    )

}

export function useSnackbarContext () {
    const context = useContext(SnackBarContext);
    return context;
}