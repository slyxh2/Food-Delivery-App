import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaruant.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";


@Resolver(of => Restaurant)
export class RestaruantResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @Query(returns => [Restaurant])
    restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Restaurant)
    async createRestaurant(@Args('input') restaurant: CreateRestaurantDto) {
        let res = await this.restaurantService.createRestaurant(restaurant);
        return res;
    }

    @Mutation(returns => Boolean)
    async updateRestaurant(
        @Args('input') inf: UpdateRestaurantDto
    ) {
        try {
            await this.restaurantService.updateRestaurant(inf);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

