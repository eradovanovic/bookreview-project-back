import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {CustomError} from "../../../middleware/CustomError";
import {CollectionDTO} from "./CollectionDTO";
import {ReviewRepository} from "../Review/ReviewRepository";
import {GenreRepository} from "../Genre/GenreRepository";

@Service({ global: true })
export class CollectionRepository {
    constructor(private database: Database, private genreRepository: GenreRepository, private reviewRepository: ReviewRepository) {
    }

    sortHandler(sortBy) {
        switch (sortBy) {
            case 'reviews':
                return 'COUNT(reviews.id)'
            case 'rating':
                return 'AVG(reviews.rating)'
            default:
                return (sortBy ?? 'id')
        }
    }

    async checkBookInCollection (body): Promise<boolean> {
        return new Promise((res, rej) => {
            return this.database.instance('collections')
                .select('*')
                .where('username', body.username)
                .andWhere('book_id', body.book_id)
                .then(result => res(result && !!result.length))
        })
    }

    async getCollectionCnt (username: String, params: any): Promise<Number> {
        return new Promise((res, rej) => {
            return this.database.instance('collections')
                .leftJoin('books', 'collections.book_id', '=', 'books.id')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'book_authors.author_id', '=', 'authors.id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .where('collections.username', username)
                .modify(function(queryBuilder) {
                    if (params.genres?.length) {
                        queryBuilder.leftJoin('book_genres', 'books.id', '=', 'book_genres.book_id')
                        queryBuilder.whereIn('book_genres.genre_id', params.genres);
                        queryBuilder.groupBy('books.id', 'author_id', 'authors.name', 'authors.surname');
                    }
                })
                .then(result => {
                    if (result) {
                        return res(result.length)
                    }
                    else {
                        rej(new CustomError(500, 'Error fetching books'))
                    }
                })
        })
    }

    async getCollectionForUser(username: String, params: any): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('collections')
                .leftJoin('books', 'collections.book_id', '=', 'books.id')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'book_authors.author_id', '=', 'authors.id')
                .leftJoin('reviews', 'books.id', '=', 'reviews.book_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .count('reviews.id as number_of_reviews')
                .avg('reviews.rating as rating')
                .where('collections.username', username)
                .orderBy(this.database.instance.raw(this.sortHandler(params.sortBy)), params.order ?? 'asc')
                .offset((params.page - 1) * params.booksPerPage)
                .limit(params.booksPerPage)
                .modify(function(queryBuilder) {
                    if (params.genres?.length) {
                        queryBuilder.leftJoin('book_genres', 'books.id', '=', 'book_genres.book_id')
                        queryBuilder.whereIn('book_genres.genre_id', params.genres);
                        // queryBuilder.groupBy('books.id', 'author_id', 'authors.name', 'authors.surname');
                    }
                })
                .groupBy('books.id', 'author_id', 'authors.name', 'authors.surname')
                .then(async (result) => {
                    const total = await this.getCollectionCnt(username, params)
                    const books = []
                    if (result && result.length) {
                        for (const r of result) {
                            await this.genreRepository.getBookGenres(r.id)
                                .then(resultG => books.push({
                                    ...r,
                                    genres: resultG,
                                }));
                        }
                        return res({
                            books: [...books],
                            total
                        });
                    } else {
                        rej(new CustomError(500, 'Internal server error'));
                    }
                })
                .catch(error => {
                    console.log(error)
                    rej(new CustomError(500, error))
                })
        })
    }

    async addToCollection(collection:CollectionDTO): Promise<CollectionDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('collections')
                .insert({
                    book_id: collection.book_id,
                    username: collection.username,
                }).then(async result => {
                    if (result && result.length) {
                        return res({...collection})
                    }
                    else {
                        rej(new CustomError(500, 'Error adding book to collection'))
                    }
                })
                .catch(error => {
                    console.log(error)
                    rej(new CustomError(500, 'Error adding book to collection'))
                })
        })
    }

    async deleteFromCollection(username: string, book_id: number): Promise<String> {
        return new Promise(async (res, rej) => {
            await this.database.instance('collections')
                .select('*')
                .where('book_id', book_id)
                .andWhere('username', username)
                .del()
            return res('OK');
        })
    }
}
