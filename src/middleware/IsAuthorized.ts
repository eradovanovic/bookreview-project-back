import Container, { Service } from 'typedi'
import { NextFunction, Response } from 'express'
import { JwtToken } from "../controllers/Auth/jwt/JwtToken"
import { JwtRequest } from './Authorization'
import { CustomError } from "./CustomError"

@Service()
export class IsAuthorized {

  guard(jwt: JwtToken, roles: string[]): boolean {
    return !!jwt && roles.some(role => jwt.scopes.includes(role))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAuthorized(roles: string[]): any {
  const check = Container.get(IsAuthorized)
  return function use(request: JwtRequest, response: Response, next?: NextFunction) {
    const isAuth = check.guard(request.jwt, roles)
    if (isAuth) {
      return next()
    }
    next(new CustomError(401, 'User is not authorized'))
  }
}
