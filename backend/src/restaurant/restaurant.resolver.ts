import { Resolver, Query, Args, Mutation, ResolveField, Int, Parent } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaruant.entity";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dto/create-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User, UserRole } from 'src/users/entities/users.entity'
import { Role } from "src/auth/role.decorator";
import { EditProfileOutput } from "src/users/dto/edit-profile.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dto/edit-restaurant.dto";
import { DeleteRestaruantInput, DeleteRestaruantOutput } from "./dto/delete-restaurant.dto";
import { Category } from "./entities/category.entity";
import { AllCategoriesOutput } from "./dto/all-categories.dto";
import { FindCategoryBySlugInput, FindCategoryBySlugOutput } from "./dto/category.dto";
import { RestaurantInput, RestaurantOutput } from "./dto/restaurants.dto";
import { FindRestaurantByIdInput, FindRestaurantByIdOutput } from "./dto/find-restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dto/search-restaurant.dto";
import { Dish } from "./entities/dish.entity";
import { CreateDishInput, CreateDishOutput } from "./dto/create-dish.dto";
import { EditDishInput, EditDishOutput } from "./dto/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dto/delete-dish.dto";

@Resolver(of => Restaurant)
export class RestaruantResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @Query(returns => RestaurantOutput)
    async restaurants(@Args('input') input: RestaurantInput): Promise<RestaurantOutput> {
        return this.restaurantService.allRestaurant(input);
    }

    @Query(returns => FindRestaurantByIdOutput)
    async restaurant(@Args('input') input: FindRestaurantByIdInput) {
        return this.restaurantService.findRestaurantById(input);
    }

    @Query(returns => SearchRestaurantOutput)
    async searchRestaurant(@Args('input') input: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(input);
    }

    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @Args('input') restaurant: CreateRestaurantInput,
        @AuthUser() authUser: User
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(restaurant, authUser);
    }

    @Mutation(returns => EditProfileOutput)
    @Role(['Owner'])
    async editRestaurant(
        @AuthUser() authUser: User,
        @Args('input') resInf: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        let res = await this.restaurantService.editRestaurant(authUser, resInf);
        return res;
    }

    @Mutation(returns => DeleteRestaruantOutput)
    @Role(['Owner'])
    async deleteRestaruant(
        @AuthUser() authUser: User,
        @Args('input') id: DeleteRestaruantInput
    ): Promise<DeleteRestaruantOutput> {
        return this.restaurantService.deleteRestaurant(authUser, id);
    }


}

@Resolver(of => Category)
export class CategoryResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @ResolveField(type => Int)
    async restaurantCount(@Parent() category): Promise<number> {
        return this.restaurantService.countRestaurant(category)
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }

    @Query(type => FindCategoryBySlugOutput)
    category(
        @Args('input') input: FindCategoryBySlugInput
    ): Promise<FindCategoryBySlugOutput> {
        return this.restaurantService.findCategoryBySlug(input);
    }
}

@Resolver(of => Dish)
export class DishResolver {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @Mutation(type => CreateDishOutput)
    @Role(['Owner'])
    async createDish(
        @AuthUser() authUser,
        @Args('input') input: CreateDishInput
    ): Promise<CreateDishOutput> {
        return this.restaurantService.createDish(authUser, input);
    }

    @Mutation(type => EditDishOutput)
    @Role(['Owner'])
    async editDish(
        @AuthUser() authUser,
        @Args('input') input: EditDishInput
    ): Promise<EditDishOutput> {
        return this.restaurantService.editDish(authUser, input);
    }

    @Mutation(type => DeleteDishOutput)
    @Role(['Owner'])
    async deleteDish(
        @AuthUser() authUser,
        @Args('input') input: DeleteDishInput
    ): Promise<EditDishOutput> {
        return this.restaurantService.deleteDish(authUser, input);
    }


}