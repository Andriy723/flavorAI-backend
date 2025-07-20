import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
    imports: [AuthModule, UsersModule, RecipesModule, RatingsModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}