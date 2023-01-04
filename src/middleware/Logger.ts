import {ExpressMiddlewareInterface, Middleware, Req} from 'routing-controllers'
import { Request, Response } from 'express'
import { Service } from "typedi"

@Middleware({ type: 'before', priority: 998 })
@Service()
export class Logger implements ExpressMiddlewareInterface {

  use(request: Request, response: Response, next?: (err?: any) => any): any {
    console.log('New request: ', request.method, ': ', request.path)
    if (request.body) {
      console.log('request body: ', request.body)
    }
    next()
  }
}
