import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

export class RegistrationCommand {
  @IsString()
  @IsOptional()
  uuid?: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsNumber()
  @IsOptional()
  age: number

  @IsEmail()
  @IsNotEmpty()
  email: string
}
