import {IsNotEmpty, IsString} from "class-validator";

export class GenreDTO {
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
