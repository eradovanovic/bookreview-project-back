import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {CustomError} from "../../../middleware/CustomError";
import {AuthorDTO} from "./AuthorDTO";

@Service({ global: true })
export class AuthorRepository {
    constructor(private database: Database, ) {
    }

    async getAuthorsCnt (): Promise<Number> {
        return new Promise((res, rej) => {
            return this.database.instance('authors')
                .leftJoin('book_authors', 'authors.id', '=', 'book_authors.author_id')
                .select('authors.*')
                .count('book_authors.book_id as bookNum' )
                .groupBy('authors.id')
                .then(result => {
                    if (result && result.length) {
                        return res(result.length)
                    } else {
                        return res(0)
                    }
                })
                .catch(error => res(0))
        })
    }

    async getAllAuthors(params:any): Promise<Object> {
        return new Promise((res, rej) => {
            return this.database.instance('authors')
                .leftJoin('book_authors', 'authors.id', '=', 'book_authors.author_id')
                .select('authors.*')
                .count('book_authors.book_id as bookNum' )
                .groupBy('authors.id')
                .offset((params.page - 1) * params.authorsPerPage)
                .limit(params.authorsPerPage)
                .then(async result => {
                    const authorsCnt = await this.getAuthorsCnt()
                    if (result && result.length) {
                        return res({
                            authors: [...result],
                            total: authorsCnt
                        })
                    } else {
                        rej(new CustomError(500, 'Internal server error'));
                    }
                })
                .catch(error => rej(new CustomError(500, error)))
        })
    }

    async getAuthorById(id: number): Promise<AuthorDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('authors').select('*')
                .where('id', id)
                .then(result => {
                    if (result && result.length) {
                        return res({...result[0]})
                    } else {
                        rej(new CustomError(500, 'Internal server error'));
                    }
                })
                .catch(error => rej(new CustomError(500, error)))
        })
    }

    async addAuthor(author:AuthorDTO): Promise<AuthorDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('authors')
                .insert({
                    id: null,
                    name: author.name,
                    surname: author.surname,
                    biography: author.biography,
                    photo: author.photo,
                }).then(async result => {
                    if (result && result.length) {
                        return res({...author, id: result[0]});
                    }
                    else {
                        rej(new CustomError(500, 'Error saving user'));
                    }
                })
        })
    }

    async updateAuthor(id: number, author:AuthorDTO): Promise<AuthorDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('authors')
                .where('id', '=', id)
                .update({
                    name: author.name,
                    surname: author.surname,
                    biography: author.biography,
                    photo: author.photo,
                })
                .then(result => {
                    console.log(result)
                    res(result)
                })

        })
    }
}
