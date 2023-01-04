import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import * as bodyParser from 'body-parser'
import { Service } from "typedi"
import { Request, Response } from 'express'

// https://www.npmjs.com/package/routing-controllers#creating-your-own-express-middleware
@Middleware({ type: 'before', priority: 999 })
@Service()
export class UrlEncoder implements ExpressMiddlewareInterface {

    use(request: Request, response: Response, next?: (err?: any) => any): any {
        const bp = bodyParser.json()
        bp(request, response, next)
    }
}
