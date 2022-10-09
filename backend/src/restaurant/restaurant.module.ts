import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaruant.entity';
import { RestaruantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant])
    ],
    providers: [RestaruantResolver, RestaurantService]
})
export class RestaurantModule { }
