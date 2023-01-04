import {Service} from "typedi";
import {Database} from "../../../db/Database";
import {CustomError} from "../../../middleware/CustomError";
import {GenreDTO} from "./GenreDTO";

@Service({ global: true })
export class GenreRepository {
    constructor(private database: Database) {
    }

    async addGenre(genre:GenreDTO): Promise<GenreDTO> {
        return new Promise((res, rej) => {
            return this.database.instance('genres')
                .insert({
                    id: null,
                    name: genre.name
                }).then(async result => {
                    if (result && result.length) {
                        return res({...genre, id: result[0]});
                    }
                    else {
                        rej(new CustomError(500, 'Error saving user'));
                    }
                })
        })
    }

    async getBookGenres(id: number): Promise<Array<GenreDTO>> {
        return new Promise((res, rej) => {
            return this.database.instance('genres')
                .join('book_genres', 'genres.id', '=', 'book_genres.genre_id')
                .select('id', 'name')
                .where('book_genres.book_id', id)
                .then(result => {
                    if (result && result.length) {
                        return res([...result])
                    }
                    else{
                        return res(null);
                    }
                })
        })
    }

    async getAllGenres(): Promise<Array<GenreDTO>> {
        return new Promise((res, rej) => {
            return this.database.instance('genres')
                .select('id', 'name')
                .then(result => {
                    if (result && result.length) {
                        return res([...result])
                    }
                    else{
                        return res([]);
                    }
                })
        })
    }
}
