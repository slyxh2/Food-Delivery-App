import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaruant.entity";
import { Like, Raw, Repository } from 'typeorm';
import { CreateRestaurantInput } from "./dto/create-restaurant.dto";
import { User } from "src/users/entities/users.entity";
import { CreateAccountOutput } from "src/users/dto/create-account.dto";
import { Category } from "./entities/category.entity";
import { EditRestaurantInput, EditRestaurantOutput } from "./dto/edit-restaurant.dto";
import { CategoryRepository } from './repository/category.repository'
import { DeleteRestaruantInput, DeleteRestaruantOutput } from "./dto/delete-restaurant.dto";
import { AllCategoriesOutput } from "./dto/all-categories.dto";
import { FindCategoryBySlugInput, FindCategoryBySlugOutput } from "./dto/category.dto";
import { RestaurantInput, RestaurantOutput } from "./dto/restaurants.dto";
import { FindRestaurantByIdInput, FindRestaurantByIdOutput } from "./dto/find-restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dto/search-restaurant.dto";
import { CreateDishInput, CreateDishOutput } from "./dto/create-dish.dto";
import { Dish } from "./entities/dish.entity";
import { EditDishInput, EditDishOutput } from "./dto/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dto/delete-dish.dto";
import { ITEM_PER_PAGE } from "src/common/common.const";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category) private readonly categories: Repository<Category>,
        @InjectRepository(Dish) private readonly dishes: Repository<Dish>
    ) { }
    async createRestaurant(resInf: CreateRestaurantInput, owner: User): Promise<CreateAccountOutput> {
        try {
            let category = await CategoryRepository.getOrCreate(resInf.categoryName);
            const newRestaurant = this.restaurants.create(resInf);
            newRestaurant.owner = owner;
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }
    async editRestaurant(owner: User, resInf: EditRestaurantInput): Promise<EditRestaurantOutput> {
        try {
            let restaruant = await this.restaurants.findOne({
                where: { id: resInf.restaurantId },
                loadRelationIds: true
            });
            if (!restaruant) return { ok: false, error: 'Restaurant not found' };

            if (owner.id !== restaruant.ownerId) {
                return { ok: false, error: 'You can not edit a restaurant that you do not own' }
            }
            let category: Category = null;
            if (resInf.categoryName) {
                category = await CategoryRepository.getOrCreate(resInf.categoryName);
            }
            await this.restaurants.save([{
                id: resInf.restaurantId,
                ...resInf,
                category: category ? category : null
            }])
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }

    async deleteRestaurant(owner, { restaurantId }: DeleteRestaruantInput): Promise<DeleteRestaruantOutput> {
        try {
            let restaruant = await this.restaurants.findOne({
                where: { id: restaurantId },
                loadRelationIds: true
            });
            if (!restaruant) return { ok: false, error: 'Restaurant not found' };

            if (owner.id !== restaruant.ownerId) {
                return { ok: false, error: 'You can not delete a restaurant that you do not own' };
            }
            await this.restaurants.delete(restaurantId);
            return { ok: true }
        } catch (error) {
            return { ok: false, error };
        }


    }

    async allRestaurant(input: RestaurantInput): Promise<RestaurantOutput> {
        const { page } = input;
        try {
            const [restaurants, totalItem] = await this.restaurants.findAndCount({
                skip: (page - 1) * ITEM_PER_PAGE,
                take: ITEM_PER_PAGE,
                order: {
                    isPromoted: 'DESC'
                }
            });
            const totalPage = Math.ceil(totalItem / ITEM_PER_PAGE);
            return { ok: true, totalPage, restaurants };
        } catch (error) {
            return { ok: false, error: 'can not get the restaurant list' }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return { ok: true, categories };
        } catch (error) {
            return { ok: false, error: 'Could nor load categories' }
        }
    }

    async countRestaurant(category: Category): Promise<number> {
        const count = await this.restaurants
            .createQueryBuilder('restaurant')
            .leftJoinAndSelect('restaurant.category', 'category')
            .where("category.slug=:slug", { slug: category.slug })
            .getCount();

        return count;
    }

    async findCategoryBySlug(input: FindCategoryBySlugInput): Promise<FindCategoryBySlugOutput> {
        const { slug, page } = input;
        try {
            const category = await this.categories.findOne({
                where: { slug }
            });
            if (!category) return { ok: false, error: "can not find the category" };

            const restaurants = await this.restaurants
                .createQueryBuilder('restaurant')
                .leftJoinAndSelect('restaurant.category', 'category')
                .where("category.slug=:slug", { slug: category.slug })
                .skip((page - 1) * ITEM_PER_PAGE)
                .take(ITEM_PER_PAGE)
                .getMany();
            const totalRestaurant = await this.countRestaurant(category);
            const totalPage = Math.ceil(totalRestaurant / ITEM_PER_PAGE);
            return { ok: true, category, totalPage, restaurants };
        } catch (error) {
            return { ok: false, error: "can not find the category" }
        }
    }

    async findRestaurantById(input: FindRestaurantByIdInput): Promise<FindRestaurantByIdOutput> {
        try {
            const { restaurantId } = input;
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId },
                relations: ["menu"]
            });
            if (!restaurant) return { ok: false, error: 'can not find the restaurant by id' };
            return { ok: true, restaurant };

        } catch (err) {
            return { ok: false, error: 'can not find the restaurant by id' };
        }
    }

    async searchRestaurantByName(input: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const { query, page } = input;
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
                skip: (page - 1) * ITEM_PER_PAGE,
                take: ITEM_PER_PAGE
            });
            return { ok: true, restaurants, totalResults, totalPage: Math.ceil(totalResults / ITEM_PER_PAGE) };
        } catch (err) {
            return { ok: false, error: err };
        }

    }

    async createDish(owner: User, input: CreateDishInput): Promise<CreateDishOutput> {
        try {
            const { restaurantId } = input;
            const restaurant: Restaurant = await this.restaurants.findOne({
                where: { id: restaurantId }
            });
            if (!restaurant) return { ok: false, error: "Restaurant was not found" };
            if (owner.id !== restaurant.ownerId) return { ok: false, error: "Only the owner can create the dish" };

            const dish = await this.dishes.save(this.dishes.create({ ...input, restaurant }));
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }


    }

    async editDish(owner: User, input: EditDishInput): Promise<EditDishOutput> {
        try {
            const { dishId } = input;
            const dish = await this.dishes.findOne({
                where: { id: dishId },
                relations: ['restaurant']
            });
            if (!dish) return { ok: false, error: "Dish was not found" };
            if (dish.restaurant.ownerId !== owner.id) return { ok: false, error: "You can't edit this dish" };
            let inputKeys = Object.keys(input);
            inputKeys.forEach(key => {
                dish[key] = input[key];
            });
            // const a = await this.dishes.save(this.dishes.create(dish));
            await this.dishes.save(this.dishes.create(dish));
            return { ok: true }
        } catch (error) {
            return { ok: false, error };
        }
    }

    async deleteDish(owner: User, input: DeleteDishInput): Promise<DeleteDishOutput> {
        try {
            const { dishId } = input;
            const dish = await this.dishes.findOne({
                where: { id: dishId },
                relations: ['restaurant']
            });
            if (!dish) return { ok: false, error: "Dish was not found" };
            if (dish.restaurant.ownerId !== owner.id) return { ok: false, error: "You can't delete this dish" };
            await this.dishes.delete(dishId);
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }

    }

}

