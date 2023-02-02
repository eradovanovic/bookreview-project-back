import { Inject, Service } from 'typedi'
import * as crypt from 'bcrypt'

import { UserDTO } from "../Data/User/UserDTO"
import { AuthenticateCommand } from './AuthenticateCommand'
import { Tokenizer } from './jwt/Tokenizer'
import { UserRepository } from "../Data/User/UserRepository"
import { CustomError } from "../../middleware/CustomError"
import {RegistrationCommand} from "./RegistrationCommand";
import {UserController} from "../Data/User/UserController";

@Service({ global: true })
export class AuthService {
  constructor(
    private readonly tokenizer: Tokenizer,
    private userRepository: UserRepository,
    @Inject('config:authorization') private authConf: Record<string, string>,
  ) {
  }

  async checkUser(username: string): Promise<unknown> {
    return new Promise(async (res, rej) => {
      const loggedInUser = await this.userRepository.getUserByUsername(username)
      if (loggedInUser) {
        const userRoles = await this.userRepository.getUserRoles(loggedInUser.username)
        return res({
          user: {
            username: loggedInUser.username,
            name: loggedInUser.name,
            surname: loggedInUser.surname,
            email: loggedInUser.email,
            photo: loggedInUser.photo,
            type: userRoles[0],
          },
        })
      }
      else return rej(new CustomError(404, 'User not found'))
    })
  }

  async loginUser(user: AuthenticateCommand): Promise<unknown> {
    return new Promise(async (res, rej) => {
      const loggedInUser = await this.userRepository.getUserByUsername(user.username)
      if (loggedInUser) {
        const isSamePassword = user.password === loggedInUser.password
        if (isSamePassword) {
          const userRoles = await this.userRepository.getUserRoles(loggedInUser.username)
          const userToken = await this.tokenizer.generateUserToken(loggedInUser.username, userRoles)
          return res({
            user: {
              username: loggedInUser.username,
              email: loggedInUser.email,
              name: loggedInUser.name,
              surname: loggedInUser.surname,
              photo: loggedInUser.photo,
              type: userRoles[0],
            },
            token: userToken,
          })
        }
        else return rej(new CustomError(401, 'Invalid credentials'))
      } else {
        return rej(new CustomError(401, 'Invalid credentials'))
      }
    })
  }

  async registerUser(user: UserDTO): Promise<UserDTO> {
    // const saltRounds = this.authConf.saltRounds
    // const salt = await crypt.genSalt(saltRounds)
    // const password = await crypt.hash(user.password, salt)
    return this.userRepository.saveUser(user)
  }
}
