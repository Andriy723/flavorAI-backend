import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
        try {
            return await this.recipesService.create(createRecipeDto, req.user.userId);
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to create recipe',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll(@Query('search') search?: string) {
        try {
            return await this.recipesService.findAll(search);
        } catch (error) {
            throw new HttpException(
                'Failed to fetch recipes',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('my-recipes')
    @UseGuards(JwtAuthGuard)
    async findMyRecipes(@Request() req) {
        try {
            return await this.recipesService.findByAuthor(req.user.userId);
        } catch (error) {
            throw new HttpException(
                'Failed to fetch your recipes',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.recipesService.findOne(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Recipe not found',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRecipeDto: UpdateRecipeDto,
        @Request() req,
    ) {
        try {
            return await this.recipesService.update(id, updateRecipeDto, req.user.userId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error.message || 'Failed to update recipe',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        try {
            return await this.recipesService.remove(id, req.user.userId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error.message || 'Failed to delete recipe',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}