import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    surname: string;

    @IsString()
    @IsOptional()
    photo: string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsInt()
    @IsOptional()
    type_id: number;

    @IsString()
    @IsOptional()
    type: string;
}
