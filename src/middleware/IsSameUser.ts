import Container, { Service } from 'typedi'
import { NextFunction, Response } from 'express'
import { JwtToken } from "../controllers/Auth/jwt/JwtToken"
import { JwtRequest } from "./Authorization"
import { CustomError } from "./CustomError"

/**
 * Checks if the user specified in the uuid argument is the
 * same as the one specified in JWT.
 */
@Service()
export class IsSameUser {
  guard(jwt: any, uuid: number): boolean {
    return jwt && jwt.subject === uuid;
  }
}

/**
 * Performs IsSameUser guard by looking up user uuid in the request
 */
export function isSameUser(): any {
  const check: IsSameUser = Container.get(IsSameUser);
  return function use(request: JwtRequest, response: Response, next?: NextFunction) {
    const isSame = check.guard(request.jwt, +request.params.id)
    if (isSame) {
      return next()
    }
    next(new CustomError(401, 'User is not authorized'))
  }
}
