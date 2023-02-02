import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class BookDTO {
    id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    genres: Array<Object>;
    authorID :number;
    author: string;
    datePublished: string;
    photo: string;
    numberOfReviews: number;
    rating: number;
}
