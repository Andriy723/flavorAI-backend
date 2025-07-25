import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsNotEmpty()
    recipeId: string;
}