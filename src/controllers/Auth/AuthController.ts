import {Body, Get, JsonController, Post, UseBefore, Req, Res, UseAfter} from 'routing-controllers'
import { Service } from 'typedi'

import { UserDTO } from "../Data/User/UserDTO"
import { RegistrationCommand } from './RegistrationCommand'
import { AuthenticateCommand } from './AuthenticateCommand'
import { AuthService } from './AuthService'
import { Tokenizer } from './jwt/Tokenizer'
import { isAnonymous } from "../../middleware/IsAnonymous"
import {checkUser} from "../../middleware/CheckUser";
import {response, Response} from "express";
import {UserRepository} from "../Data/User/UserRepository";
import {CustomError} from "../../middleware/CustomError";
import {CustomErrorHandler} from "../../middleware/ErrorHandler";

@JsonController('/')
@Service({ global: true })
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly tokenizer: Tokenizer) {
  }

  @Get('me')
  @UseBefore(checkUser())
  async checkLoggedUser(@Res() response: any): Promise<unknown> {
    const username = response.req.jwt.subject
    return this.authService.checkUser(username)
  }

  @Post('login')
  @UseBefore(isAnonymous())
  async login(@Body() user: AuthenticateCommand): Promise<unknown> {
    return this.authService.loginUser(user)
  }

  @Post('register')
  @UseBefore(isAnonymous())
  async register(@Body() user: UserDTO): Promise<UserDTO> {
    return this.authService.registerUser(user)
  }
}
