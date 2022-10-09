import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaruant.entity";
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";



@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>
    ) { }
    getAll(): Restaurant[] {
        return [];
    }
    async createRestaurant(res: CreateRestaurantDto): Promise<Restaurant> {
        const newRestaurant = this.restaurants.create(res);
        let result = this.restaurants.save(newRestaurant);
        console.log(await result);
        return result;
    }
    updateRestaurant(inf: UpdateRestaurantDto) {
        const { id, data } = inf;
        return this.restaurants.update(id, data);
    }
}