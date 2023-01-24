import {JsonController, Get, Param, Post, Delete, Body, Put, UseBefore} from "routing-controllers";
import {Service} from "typedi";
import {AuthorRepository} from "./AuthorRepository";
import {isAuthorized} from "../../../middleware/IsAuthorized";

@JsonController('/authors')
@Service({global: true})
export class AuthorController {
    constructor(private authorRepository: AuthorRepository) {
    }

    @UseBefore(isAuthorized(['admin']))
    @Get('/uploadPhoto')
    uploadPhoto() {
        return new Promise((res, rej) => res('054e02d81609aa2bba6579bb124c2202'))
    }

    @Post('/')
    getAll(@Body() params: any) {
        return this.authorRepository.getAllAuthors(params);
    }

    @Get('/:id')
    getAuthorById(@Param('id') id: number) {
        return this.authorRepository.getAuthorById(id);
    }

    @UseBefore(isAuthorized(['admin']))
    @Post('/addAuthor')
    post(@Body() author: any) {
        return this.authorRepository.addAuthor(author);
    }

    @Put('/:id')
    put(@Param('id') id: number, @Body() author: any) {
        return this.authorRepository.updateAuthor(id, author);
    }


}
