import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaruant.entity';
import { CategoryResolver, RestaruantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, Category])
    ],
    providers: [RestaruantResolver, RestaurantService, CategoryResolver]
})
export class RestaurantModule { }
