import {JsonController, Get, Param, Post, Delete, Body, Put, UseBefore} from "routing-controllers";
import {Service} from "typedi";
import {BookRepository} from "./BookRepository";
import {isAuthorized} from "../../../middleware/IsAuthorized";
import {isSameUser} from "../../../middleware/IsSameUser";

@JsonController('/books')
@Service({global: true})
export class BookController {
    constructor(private bookRepository: BookRepository) {
    }

    @UseBefore(isAuthorized(['admin']))
    @Get('/uploadPhoto')
    uploadPhoto() {
        return new Promise((res, rej) => res('054e02d81609aa2bba6579bb124c2202'))
    }

    @Post('/')
    getAll(@Body() params: any) {
        return this.bookRepository.getAllBooks(params);
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.bookRepository.getBookById(id);
    }

    @Post('/authors/:id')
    getBooksForAuthor(@Param('id') id: number,  @Body() params:any) {
        return this.bookRepository.getBooksByAuthor(id, params);
    }

    @UseBefore(isAuthorized(['admin']))
    @Post('/addBook')
    saveBook(@Body() book: any) {
        return this.bookRepository.saveBook(book);
    }

    @Post('/search')
    search(@Body() body: any) {
        return this.bookRepository.search(body);
    }
}
