import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class ReviewDTO {
   id: number;

   date_reviewed: Date;
   review: string;
   rating: string;
   username: string;
   book_id: number;
   book_title: string;
}
