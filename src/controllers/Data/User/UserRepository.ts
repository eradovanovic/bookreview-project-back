import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {UserDTO} from "./UserDTO";
import {CustomError} from "../../../middleware/CustomError";
import {validate} from "class-validator";
import {ChangePasswordCommand} from "./ChangePasswordCommand";

@Service({ global: true })
export class UserRepository {
    constructor(private database: Database) {
    }

    async loadUsersProfile(username: string): Promise<UserDTO> {
        return new Promise(async (res, rej) => {
            const user = await this.getUserByUsername(username)
            if (user) {
                return res(user)
            }
            else {
                rej(new CustomError(404, 'User doesn\'t exist'))
            }
        })
    }

    async getUserByUsername(username: string): Promise<UserDTO> {
        return new Promise ((res, rej) => {
            return this.database.instance('users')
                .select('username', 'email', 'password', 'name', 'surname', 'photo')
                .where('username', username)
                .then(result => {
                    if (result?.length) {
                        return res(result[0])
                    }
                    else {
                        return res(null);
                    }
                })
        })
    }

    async getUserByEmail(email: string): Promise<UserDTO> {
        return new Promise ((res, rej) => {
            return this.database.instance('users')
                .select('username', 'email', 'password', 'name', 'surname')
                .where('email', email)
                .then(result => {
                    if (result?.length) {
                        return res(result[0])
                    }
                    else {
                        return res(null);
                    }
                })
        })
    }

    async saveUser(user: UserDTO): Promise<UserDTO> {
        return new Promise(async (res, rej) => {
            const existingUserUsername = await this.getUserByUsername(user.username)
            if (!existingUserUsername) {
                const existingUserEmail = await this.getUserByEmail(user.email)
                if(!existingUserEmail) {
                    return this.database.instance('roles').select('id')
                        .where('name', 'user')
                        .then(result => {
                            if (result && result.length) {
                                const type_id = result[0].id;
                                return this.database.instance('users')
                                    .insert({
                                        username: user.username,
                                        password: user.password,
                                        name: user.name,
                                        surname: user.surname,
                                        email: user.email,
                                        photo: user.photo,
                                        type: type_id
                                    }).then(async result => {
                                        if (result && result.length) {
                                            return res({...user, type: 'user'});
                                        }
                                        else {
                                            rej(new CustomError(500, 'Error saving user'));
                                        }
                                    }).catch(error => rej(new CustomError(error.code, error.message)))
                            }
                            else {
                                rej(new CustomError(500, 'Internal server error'));
                            }
                        })
                        .catch(error => rej(new CustomError(error.code, error.message)))
                } else {
                    rej(new CustomError(409, 'User with this email already exists'));
                }

            } else {
                rej(new CustomError(409, 'User with this username already exists'));
            }

        })
    }

    async getUserRoles(username: string): Promise<string[]> {
        return new Promise((res, rej) => {
            this.database.instance('roles')
                .join('users', 'roles.id', '=', 'users.type')
                .select('roles.name')
                .where('users.username', username)
                .then(result => {
                    // console.log('*** result: ', result)
                    if (result) {
                        return res(result.map(({ name }) => name))
                    } else {
                        return rej(new CustomError(500, 'User doesn\'t have assigned roles'))
                    }
                })
                .catch(err => rej(new CustomError(500, 'Error getting user roles, message: ' + err)))
        })
    }

    async updateUser (user: UserDTO): Promise<UserDTO> {
        return new Promise(async (res, rej) => {
            const emailUser = user.email ? await this.getUserByEmail(user.email) : null
            if (!emailUser || emailUser.username === user.username) {
                this.database.instance('users')
                    .where('username', user.username)
                    .update({
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        photo: user.photo,
                    })
                    .then(result => res(result))
            }
            else {
                rej(new CustomError(409, 'User with this email already exists'))
            }
        })
    }

    async changePassword (user: ChangePasswordCommand): Promise<UserDTO> {
        return new Promise(async (res, rej) => {
            const loggedUser = await this.getUserByUsername(user.username)
            if (loggedUser.password === user.password) {
                this.database.instance('users')
                    .where('username', user.username)
                    .update('password', user.newPassword)
                    .then(result => res(result))
            }
            else {
                rej( new CustomError(401, 'Incorrect password.'))
            }
        })
    }

    async deleteUser(username: string): Promise<string> {
        return new Promise((res, rej) => {
            this.database.instance('users')
                .where('username', username)
                .del()
                .then(() => res('OK'))
        })
    }
}
