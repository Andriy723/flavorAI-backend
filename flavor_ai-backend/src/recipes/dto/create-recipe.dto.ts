import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateRecipeDto {
    @IsString()
    @MaxLength(100)
    title: string;

    @IsString()
    ingredients: string;

    @IsString()
    instructions: string;

    @IsInt()
    @Min(1)
    cookTime: number;

    @IsInt()
    @Min(1)
    servings: number;
}
