export class CustomError {
    code: number
    message: string

    constructor(code, message) {
        this.code = code
        this.message = message
    }
}
