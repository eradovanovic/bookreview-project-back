import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AuthenticateCommand {
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string
}
