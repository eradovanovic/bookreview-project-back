import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {CustomError} from "../../../middleware/CustomError";
import {ReviewDTO} from "./ReviewDTO";

@Service({ global: true })
export class ReviewRepository {
    constructor(private database: Database) {
    }

    async checkIfReviewed (review): Promise<boolean> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .select('*')
                .where('username', review.username)
                .andWhere('book_id', review.book_id)
                .then(result => res(result && !!result.length))
                .catch(error => console.log(error))
        })
    }

    async getNewestReviews(): Promise<Array<ReviewDTO>> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .leftJoin('users', 'reviews.username', '=', 'users.username')
                .leftJoin('books', 'reviews.book_id', '=', 'books.id')
                .select('reviews.*', 'users.photo as avatar', 'books.title as title')
                .limit(5)
                .rowNumber('alias_name', function() {
                    this.orderBy('date_reviewed', 'desc')
                })
                .then(result => {
                    if (result && result.length) {
                        return res([...result])
                    } else {
                        return res([]);
                    }
                })
        })
    }

    async getBookReviewInfo(book_id: number): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .avg('rating as avgRating')
                .count('id as reviewsNum')
                .where('book_id', book_id)
                .then(result => {
                    if (result && result.length) {
                        return res(result[0])
                    } else {
                        return res(result);
                    }
                })
                .catch(error => console.log(error))
        })
    }

    async getReviewsForBook(book_id: number): Promise<Array<ReviewDTO>> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .leftJoin('users', 'reviews.username', '=', 'users.username')
                .select('reviews.*', 'users.photo as avatar')
                .where('book_id', book_id)
                .rowNumber('alias_name', function() {
                    this.orderBy('date_reviewed', 'desc')
                })
                .then(result => {
                    if (result && result.length) {
                        return res([...result])
                    } else {
                        return res([]);
                    }
                })
                .catch(error => console.log(error))
        })
    }

    async getReviewsForUser(username: String): Promise<Array<ReviewDTO>> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .leftJoin('books', 'reviews.book_id', '=', 'books.id')
                .select('reviews.*', 'books.title as title')
                .where('username', username)
                .rowNumber('alias_name', function() {
                    this.orderBy('date_reviewed', 'desc')
                })
                .then(result => {
                    if (result && result.length) {
                        return res([...result])
                    } else {
                        return res([]);
                    }
                })
        })
    }

    async addReview(review:ReviewDTO): Promise<ReviewDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('reviews')
                .insert({
                    id: null,
                    book_id: review.book_id,
                    username: review.username,
                    date_reviewed: new Date().toJSON().slice(0, 19).replace('T', ' '),
                    rating: review.rating,
                    review: review.review
                }).then(async result => {
                    if (result && result.length) {
                        return res({...review, id: result[0]});
                    }
                    else {
                        rej(new CustomError(500, 'Error saving review'))
                    }
                })
                .catch(error => {
                    console.log(error)
                    rej(new CustomError(500, 'Error saving review'))
                })
        })
    }

    async deleteReview(id: number): Promise<String> {
        return new Promise(async (res, rej) => {
            await this.database.instance('reviews')
                .select('*')
                .where('id', id)
                .del()
            return res('OK');
        })
    }
}
