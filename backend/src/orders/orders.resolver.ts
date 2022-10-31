import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/users.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetSingleOrderInput, GetSingleOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";
import { PubSub } from 'graphql-subscriptions'
import { Any } from "typeorm";

const pubsub = new PubSub();

@Resolver(of => Order)
export class OrderResolver {
    constructor(
        private readonly orders: OrderService
    ) { }


    @Mutation(type => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() authUser,
        @Args('input') input: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.orders.createOrder(authUser, input);
    }

    @Query(returns => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') input: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        return this.orders.getOrders(user, input);
    }

    @Query(returns => GetSingleOrderOutput)
    @Role(["Any"])
    async getSingleOrder(
        @AuthUser() user: User,
        @Args('input') input: GetSingleOrderInput
    ): Promise<GetSingleOrderOutput> {
        return this.orders.getSingleOrder(user, input);
    }

    @Mutation(returns => EditOrderOutput)
    @Role(["Any"])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') input: EditOrderInput
    ): Promise<EditOrderOutput> {
        return this.orders.editOrder(user, input);
    }

    @Mutation(returns => Boolean)
    hotPotReady() {
        pubsub.publish('hotPot', {
            ready: "is ready"
        });
        return true;
    }

    @Subscription(returns => String)
    @Role(['Any'])
    hotPot(@AuthUser() user: User) {
        console.log(user);
        return pubsub.asyncIterator('hotPot');
    }
}