import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {CustomError} from "../../../middleware/CustomError";
import {GenreRepository} from "../Genre/GenreRepository";
import {BookDTO} from "./BookDTO";
import {ReviewRepository} from "../Review/ReviewRepository";

@Service({ global: true })
export class BookRepository {
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



    async getBookById(id: number): Promise<BookDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('books').select('*')
                .where('id', id)
                .then(result => {
                    if (result && result.length) {
                        return this.database.instance('authors')
                            .join('book_authors', 'authors.id', '=', 'book_authors.author_id')
                            .select('id','name', 'surname')
                            .where('book_authors.book_id', id)
                            .then(async resultA => {
                                const reviewInfo = await this.reviewRepository.getBookReviewInfo(id)
                                if (resultA && resultA.length) {
                                    return this.genreRepository.getBookGenres(result[0].id)
                                        .then(resultG => {
                                            return res({
                                                ...result[0],
                                                author_id: resultA[0].id,
                                                author: resultA[0].name + ' ' + resultA[0].surname,
                                                genres: resultG,
                                                rating: reviewInfo['avgRating'],
                                                number_of_reviews: reviewInfo['reviewsNum'],
                                            })
                                        })
                                }
                                else {
                                    return this.genreRepository.getBookGenres(result[0].id)
                                        .then(resultG => {
                                            return res({
                                                ...result[0],
                                                genres: resultG,
                                                rating: reviewInfo['avgRating'],
                                                number_of_reviews: reviewInfo['reviewsNum'],
                                            })
                                        })
                                }
                            })

                    } else {
                        rej(new CustomError(500, 'Internal server error'));
                    }
                })
        })
    }

    async getBooksCnt (params: any): Promise<Number> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
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

    async getAllBooks(params: any): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .leftJoin('reviews', 'books.id', '=', 'reviews.book_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .count('reviews.id as number_of_reviews')
                .avg('reviews.rating as rating')
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
                    const books = []
                    if (result && result.length) {
                        for (const r of result) {
                            // const reviewInfo = await this.reviewRepository.getBookReviewInfo(r.id)
                            await this.genreRepository.getBookGenres(r.id)
                                .then(resultG => books.push({
                                    ...r,
                                    genres: resultG,
                                    // number_of_reviews: reviewInfo['reviewsNum'],
                                    // rating: reviewInfo['avgRating']
                                }));
                        }
                        const count = await this.getBooksCnt(params)
                        return res({
                            books: [...books],
                            total: count
                        });
                    } else {
                        res({
                            books: [],
                            total: 0
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    rej(new CustomError(500, error))
                })
        })
    }

    async saveBook(book:BookDTO): Promise<BookDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .insert({
                    id: null,
                    title: book.title,
                    description: book.description,
                    date_published: new Date().toJSON().slice(0, 19).replace('T', ' '),
                    photo: book.photo,
                    rating: 0,
                    number_of_reviews: 0
                }).then(async result => {
                    if (result && result.length) {
                        const book_genre_objs = [];
                        book.genres.forEach(genre => book_genre_objs.push({book_id: result[0], genre_id: genre['id']}));
                        await this.database.instance('book_genres').insert(book_genre_objs);
                        await this.database.instance('book_authors').insert({book_id: result[0], author_id: book.authorID});
                        return res({...book, id: result[0]});
                    } else {
                        rej(new CustomError(500, 'Error saving user'))
                    }
                })
        })
    }

    async getBooksAuthorCnt (id: number, params: any): Promise<Number> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .where('authors.id', id)
                .then(result => {
                    if (result) {
                        return res(result.length)
                    }
                    else {
                       return res(0)
                    }
                })
        })
    }

    async getBooksByAuthor(author_id: number, params: any): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .leftJoin('reviews', 'books.id', '=', 'reviews.book_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .count('reviews.id as number_of_reviews')
                .avg('reviews.rating as rating')
                .where('author_id', author_id)
                .groupBy('books.id', 'author_id', 'authors.name', 'authors.surname')
                .offset((params.page - 1) * params.booksPerPage)
                .limit(params.booksPerPage)
                .then(async result => {
                    const total = await this.getBooksAuthorCnt(author_id, params)
                    const books = []
                    if (result && result.length) {
                        for (const r of result) {
                            await this.genreRepository.getBookGenres(r.id)
                                .then(resultG => books.push({...r, genres: resultG}));
                        }
                        return res({
                            books: [...books],
                            total
                        });
                    } else {
                        return res({ books: [], total: 0});
                    }
                })
        })
    }

    async getBooksSearchCnt (params: any): Promise<Number> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .modify(function(queryBuilder) {
                    if (params.input || params.booksPerPage !== Number.MAX_SAFE_INTEGER) {
                        queryBuilder.whereRaw('title LIKE ?', [`%${params.input}%`])
                    }
                    else {
                        return res(0)
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

    async search(params: any): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('books')
                .leftJoin('book_authors', 'books.id', '=', 'book_authors.book_id')
                .leftJoin('authors', 'authors.id', '=', 'book_authors.author_id')
                .leftJoin('reviews', 'books.id', '=', 'reviews.book_id')
                .select('books.*', 'authors.id as author_id', 'authors.name', 'authors.surname')
                .count('reviews.id as number_of_reviews')
                .avg('reviews.rating as rating')
                .groupBy('books.id', 'author_id', 'authors.name', 'authors.surname')
                .modify(function(queryBuilder) {
                    if (params.input || params.booksPerPage !== Number.MAX_SAFE_INTEGER) {
                        queryBuilder.whereRaw('title LIKE ?', [`%${params.input}%`])
                    }
                    else {
                        return res({
                            books: [],
                            total: 0
                        })
                    }
                })
                .offset((params.page - 1) * params.booksPerPage)
                .limit(params.booksPerPage)
                .then(async result => {
                    const total = await this.getBooksSearchCnt(params)
                    const books = []
                    if (result && result.length) {
                        for (const r of result) {
                            await this.genreRepository.getBookGenres(r.id)
                                .then(resultG => books.push({...r, genres: resultG}));
                        }
                        return res({
                            books,
                            total
                        });
                    } else {
                        rej(new CustomError(500, 'Internal server error'));
                    }
                })
                .catch(error => rej(new CustomError(500, error.message)))
        })
    }
}
