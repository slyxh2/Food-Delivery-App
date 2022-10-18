import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaruant.entity";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dto/create-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User, UserRole } from 'src/users/entities/users.entity'
import { Role } from "src/auth/role.decorator";
@Resolver(of => Restaurant)
export class RestaruantResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }


    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @Args('input') restaurant: CreateRestaurantInput,
        @AuthUser() authUser: User
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(restaurant, authUser);
    }


}

