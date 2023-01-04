import {JsonController, Get, Param, Post, Delete, Body, Put} from "routing-controllers";
import {Service} from "typedi";
import {GenreRepository} from "./GenreRepository";

@JsonController('/genres')
@Service({global: true})
export class GenreController {
    constructor(private genreRepository: GenreRepository) {
    }

    @Get('/')
    getAll() {
        return this.genreRepository.getAllGenres()
    }

    @Post('/')
    post(@Body() genre: any) {
        return this.genreRepository.addGenre(genre);
    }

    @Put('/:id')
    put(@Param('id') id: number, @Body() user: any) {
        return 'Updating a user...'
    }

    @Delete('/:id')
    remove(@Param('id') id: number) {
        return 'Removing user...'
    }

}
