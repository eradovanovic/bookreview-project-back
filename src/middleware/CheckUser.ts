import Container, { Service } from 'typedi'
import { NextFunction, Response } from 'express'
import { JwtToken } from "../controllers/Auth/jwt/JwtToken"
import { JwtRequest} from './Authorization'
import { CustomError } from "./CustomError"


@Service()
export class CheckUser {

    guard(jwt: JwtToken): string {
        return jwt?.subject ?? null
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkUser(): any {
    const check = Container.get(CheckUser)
    return function use(request: JwtRequest, response: Response, next?: NextFunction) {
        const username = check.guard(request.jwt)
        if (username) {
            response.locals.username = username
            next()
        }
        else {
            //response.locals.username = null
            next(new CustomError(401, 'User is not authorized'))
        }
    }
}
