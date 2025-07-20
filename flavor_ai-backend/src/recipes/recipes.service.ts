import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) {}

    async create(createRecipeDto: CreateRecipeDto, authorId: string) {
        try {
            return await this.prisma.recipe.create({
                data: {
                    title: createRecipeDto.title,
                    ingredients: createRecipeDto.ingredients,
                    instructions: createRecipeDto.instructions,
                    cookTime: createRecipeDto.cookTime,
                    servings: createRecipeDto.servings,
                    author: {
                        connect: { id: authorId }
                    },
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ratings: true,
                },
            });
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw new Error('Failed to create recipe');
        }
    }

    async findAll(search?: string) {
        try {
            return await this.prisma.recipe.findMany({
                where: search
                    ? {
                        title: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }
                    : {},
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ratings: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw new Error('Failed to fetch recipes');
        }
    }

    async findOne(id: string) {
        try {
            const recipe = await this.prisma.recipe.findUnique({
                where: { id },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ratings: true,
                },
            });

            if (!recipe) {
                throw new NotFoundException('Recipe not found');
            }

            return recipe;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error finding recipe:', error);
            throw new NotFoundException('Recipe not found');
        }
    }

    async findByAuthor(authorId: string) {
        try {
            console.log('Fetching recipes for author:', authorId);

            const recipes = await this.prisma.recipe.findMany({
                where: { authorId },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ratings: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            console.log('Found recipes:', recipes.length);
            return recipes;
        } catch (error) {
            console.error('Error fetching author recipes:', error);
            throw new Error('Failed to fetch your recipes');
        }
    }

    async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
        try {
            const recipe = await this.prisma.recipe.findUnique({
                where: { id },
            });

            if (!recipe) {
                throw new NotFoundException('Recipe not found');
            }

            if (recipe.authorId !== userId) {
                throw new ForbiddenException('You can only update your own recipes');
            }

            return await this.prisma.recipe.update({
                where: { id },
                data: updateRecipeDto,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ratings: true,
                },
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            console.error('Error updating recipe:', error);
            throw new Error('Failed to update recipe');
        }
    }

    async remove(id: string, userId: string) {
        try {
            const recipe = await this.prisma.recipe.findUnique({
                where: { id },
            });

            if (!recipe) {
                throw new NotFoundException('Recipe not found');
            }

            if (recipe.authorId !== userId) {
                throw new ForbiddenException('You can only delete your own recipes');
            }

            return await this.prisma.$transaction(async (prisma) => {
                await prisma.rating.deleteMany({
                    where: { recipeId: id }
                });

                return await prisma.recipe.delete({
                    where: { id },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            console.error('Error deleting recipe:', error);
            throw new Error('Failed to delete recipe');
        }
    }
}