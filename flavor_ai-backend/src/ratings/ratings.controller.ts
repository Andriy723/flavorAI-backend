import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
        return this.ratingsService.create(createRatingDto, req.user.userId);
    }

    @Get('recipe/:id')
    findByRecipe(@Param('id') id: string) {
        return this.ratingsService.findByRecipe(id);
    }

    @Get('recipe/:id/average')
    getAverageRating(@Param('id') id: string) {
        return this.ratingsService.getAverageRating(id);
    }
}