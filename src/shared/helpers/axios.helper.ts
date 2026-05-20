

/*Função responsável por adicionar o accessToken para fazer
 métodos get em rota privada */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosInstance } from "axios";
import { IAuthenticateResponse } from "../interfaces/http/authenticate-reposnse";

export function addTokenToRequest(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(async(config) => {

        const userData = await AsyncStorage.getItem('dt-money-user') /*pegando
        token do dispositivo do usuário através do async storage */

        if (userData) {
            /*se existir dados do usuário que é o token (username e senha) no async storage vamos dizer que  o retorno  vai ser dp
            tipo IAutheticateResponse que tem proridade login e senha  */
            const {token} = JSON.parse(userData) as IAuthenticateResponse;

            /*se o token existir vamos passar a requisição com tokenn
            se n existir vai ser só chamada da requisição */
            if(token) {
                    config.headers.Authorization = `Bearer ${token}`
            } 

        }

        return config;
    } )
}