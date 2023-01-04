import {JsonController, Get, Param, Post, Delete, Body, Put} from "routing-controllers";
import {Service} from "typedi";
import {ReviewRepository} from "./ReviewRepository";

@JsonController('/reviews')
@Service({global: true})
export class ReviewController {
    constructor(private reviewRepository: ReviewRepository) {
    }


    @Get('/newest')
    getNewest() {
        return this.reviewRepository.getNewestReviews();
    }

    @Get('/book/:id')
    getReviewsForBook(@Param('id') id: number) {
       return this.reviewRepository.getReviewsForBook(id);
    }

    @Get('/user/:username')
    getReviewsForUser(@Param('username') username: string) {
        return this.reviewRepository.getReviewsForUser(username);
    }

    @Get('/info/:id')
    getBookReviewInfo(@Param('id') id: number) {
        return this.reviewRepository.getBookReviewInfo(id);
    }


    @Post('/')
    addReview(@Body() review: any) {
        return this.reviewRepository.addReview(review);
    }

    @Post('/check')
    checkIfReviewed(@Body() review: any) {
        return this.reviewRepository.checkIfReviewed(review);
    }

    @Put('/:id')
    put(@Param('id') id: number, @Body() user: any) {
        return 'Updating a user...'
    }

    @Delete('/:id')
    remove(@Param('id') id: number) {
        return this.reviewRepository.deleteReview(id)
    }

}
