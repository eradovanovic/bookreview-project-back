import { IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswordCommand {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}
