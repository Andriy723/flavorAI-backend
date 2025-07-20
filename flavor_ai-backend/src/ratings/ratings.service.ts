import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
    constructor(private prisma: PrismaService) {}

    async create(createRatingDto: CreateRatingDto, userId: string) {
        if (createRatingDto.rating < 1 || createRatingDto.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }

        const existingRating = await this.prisma.rating.findFirst({
            where: {
                userId,
                recipeId: createRatingDto.recipeId,
            },
        });

        if (existingRating) {
            return this.prisma.rating.update({
                where: {
                    id: existingRating.id,
                },
                data: {
                    value: createRatingDto.rating,
                },
            });
        }

        return this.prisma.rating.create({
            data: {
                value: createRatingDto.rating,
                userId,
                recipeId: createRatingDto.recipeId,
            },
        });
    }

    async findByRecipe(recipeId: string) {
        return this.prisma.rating.findMany({
            where: { recipeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async getAverageRating(recipeId: string) {
        const ratings = await this.prisma.rating.findMany({
            where: { recipeId },
        });

        if (ratings.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
        const average = sum / ratings.length;

        return { average: Number(average.toFixed(1)), count: ratings.length };
    }
}
