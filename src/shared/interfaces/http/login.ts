

export interface LoginHttpParams {
    
    email: string;
    password: string;
}


export interface LoginHttpResponse {

    access_token: string,
    token_type: string,
    expires_in: number
}