
export interface RegisterHttpParams {

    firstName: string;
    email: string;
    password: string;
    phone: string;

}


export interface RegisterHttpResponse {

    
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    roles: RolesDTO[],
    phone: string,
    password: string

}

interface RolesDTO {
    id: number;
    authority: string;
}