import {  UserProps } from "../user";

 /*Tipo para reposta da autenticação */
export interface IAuthenticateResponse { 
    user: UserProps,
    token: string
}

export interface GoogleAuthResponseDTO{
    access_token: string,
    expires_in: number,
    token_type: string,
    email: string,
    name: string,
}