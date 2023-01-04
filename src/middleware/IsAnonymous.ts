import Container, { Service } from 'typedi'
import { NextFunction, Response } from 'express'
import { JwtToken } from "../controllers/Auth/jwt/JwtToken"
import { JwtRequest } from "./Authorization"
import { CustomError } from "./CustomError"

@Service()
export class IsAnonymous {

  guard(jwt: JwtToken): boolean {
    return !jwt
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAnonymous(): any {
  const check = Container.get(IsAnonymous)
  return function use(request: JwtRequest, response: Response, next?: NextFunction) {
    const isAnon = check.guard(request.jwt)
    if (isAnon) {
      return next()
    }
    next(new CustomError(401, 'user is not anonymous'))
  }
}
