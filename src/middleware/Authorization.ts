import { Inject, Service } from 'typedi'
import * as jwt from 'jsonwebtoken'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Request, Response } from 'express'

import { JwtToken } from "../controllers/Auth/jwt/JwtToken"

export interface JwtRequest extends Request {
    jwt: JwtToken
    isAuth: boolean
}
@Middleware({ type: 'before', priority: 998 })
@Service()
export class Authorization implements ExpressMiddlewareInterface {
  constructor(@Inject('config:authorization') private readonly authConf: Record<string, unknown>) { }

  async use(request: JwtRequest, response: Response, next?: (err?: unknown) => void): Promise<void> {
    const token = request.headers['authorization']
    if (token && token.startsWith('Bearer ')) {
      const jwtToken = token.split(' ')[1]
      const authPassed = jwt.verify(jwtToken, this.authConf.secret, async err => !err)
      if (authPassed) {
        request.jwt = jwt.decode(jwtToken)
        next()
      }
    }
    else {
      next()
    }
  }

  // async checkUser(request: JwtRequest, response: Response, next?: (err?: unknown) => void): Promise<void> {
  //   const token = request.headers['authorization']
  //   if (token && token.startsWith('Bearer ')) {
  //     const jwtToken = token.split(' ')[1]
  //     const authPassed = jwt.verify(jwtToken, this.authConf.secret, async err => !err)
  //     if (authPassed) {
  //       request.jwt = jwt.decode(jwtToken)
  //       next()
  //     }
  //   }
  //   else {
  //     next()
  //   }
  // }
}
