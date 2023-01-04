import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express'
import { Service } from "typedi"
import { CustomError } from "./CustomError"
import { ValidationError } from 'class-validator'

@Middleware({ type: 'after' })
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: Request, response: Response, next: (err: any) => any): any {
        if (error && error.errors && error.errors.length && error.errors[0] instanceof ValidationError) {
            return response.status(400).json({ message: "Validation error" })
        }
        if (error instanceof CustomError) {
            return response.status(error.code).json({ message: error.message })
        }
        return response.status(500).json({ message: error.message })
    }
}
