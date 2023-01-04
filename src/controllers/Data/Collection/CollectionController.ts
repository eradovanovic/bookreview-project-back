import {JsonController, Get, Param, Post, Delete, Body, Put, UseBefore, Res} from "routing-controllers";
import {Service} from "typedi";
import {CollectionRepository} from "./CollectionRepository";
import {checkUser} from "../../../middleware/CheckUser";
import {isAuthorized} from "../../../middleware/IsAuthorized";
import {isSameUser} from "../../../middleware/IsSameUser";

@JsonController('/collections')
@Service({global: true})
export class CollectionController {
    constructor(private collectionRepository: CollectionRepository) {
    }


    @Post('/')
    @UseBefore(checkUser())
    getCollectionForUser(@Res() response: any, @Body() params:any) {
        const username = response.req.jwt.subject
        return this.collectionRepository.getCollectionForUser(username, params);
    }

    @Post('/addToCollection')
    addToCollection(@Body() body: any) {
        return this.collectionRepository.addToCollection(body);
    }

    @Post('/check')
    checkBookInCollection(@Body() body: any) {
        return this.collectionRepository.checkBookInCollection(body);
    }


    @Delete('/:id')
    @UseBefore(checkUser())
    remove(@Param('id') id: number, @Res() response: any) {
        const username = response.req.jwt.subject
        return this.collectionRepository.deleteFromCollection(username, id)
    }

}
