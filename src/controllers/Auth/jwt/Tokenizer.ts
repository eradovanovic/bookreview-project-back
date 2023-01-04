import { Inject, Service } from 'typedi'
import * as jwt from 'jsonwebtoken'

@Service({ global: true })
export class Tokenizer {
  constructor(@Inject('config:authorization') private readonly authConf: Record<string, unknown>) { }

  async generateUserToken(username: string, roles: string[]): Promise<unknown> {
    const tokenBody = {
      scopes: roles,
      subject: username,
      expiresIn: this.authConf.accessExpiry,
    }
    return await jwt.sign(tokenBody, this.authConf.secret)
  }
}
