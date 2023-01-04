import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class AuthorDTO {
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
    surname: string;
    biography: string;
    photo: string;
    numberOfBooks: number;
}
