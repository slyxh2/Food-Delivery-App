import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaruant.entity';
import { CategoryResolver, DishResolver, RestaruantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, Category, Dish])
    ],
    providers: [RestaruantResolver, RestaurantService, CategoryResolver, DishResolver]
})
export class RestaurantModule { }
