
export class AppError {

    message: string;
    /*o construtor nós validamos que essa classe de error sempre possua
    a propridade de message */
    constructor(message: string) {
        this.message = message;
    }
}