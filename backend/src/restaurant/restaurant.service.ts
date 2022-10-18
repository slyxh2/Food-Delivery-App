import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaruant.entity";
import { Repository } from 'typeorm';
import { CreateRestaurantInput } from "./dto/create-restaurant.dto";
import { User } from "src/users/entities/users.entity";
import { CreateAccountOutput } from "src/users/dto/create-account.dto";
import { Category } from "./entities/category.entity";



@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category) private readonly categories: Repository<Category>
    ) { }
    async createRestaurant(resInf: CreateRestaurantInput, owner: User): Promise<CreateAccountOutput> {
        try {
            let categoryName = resInf.categoryName.trim().toLowerCase()
            let categorySlug = categoryName.replace(/ /g, '-');
            let category = await this.categories.findOne({
                where: { slug: categorySlug }
            });
            if (!category) {
                category = await this.categories.save(this.categories.create({ slug: categorySlug, name: categoryName }));
            }
            const newRestaurant = this.restaurants.create(resInf);
            newRestaurant.owner = owner;
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return { ok: true };
        } catch (error) {
            return { ok: false, error: 'Could not create restaurant' };
        }
    }

}