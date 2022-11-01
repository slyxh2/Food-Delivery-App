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
import { Inject } from "@nestjs/common";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.const";
import { OrderUpdateInput } from "./dto/order-update.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dto/take-order.dto";


@Resolver(of => Order)
export class OrderResolver {
    constructor(
        private readonly orders: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
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

    @Subscription(returns => Order, {
        filter: (payload, variables, context) => {
            const { pendingOrders } = payload;
            const { ownerId } = pendingOrders;
            const { user } = context;
            return ownerId === user.id;
        },
        resolve: (payload) => {
            const { pendingOrders } = payload;
            return pendingOrders.order;
        }
    })
    @Role(['Owner'])
    pendingOrders() {
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
    }


    @Subscription(returns => Order, {
        filter: (payload, variables, context) => {
            return true;
        }
    })
    @Role(['Delivery'])
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
    }

    @Subscription(returns => Order, {
        filter: (payload, variables, context) => {
            const { orderUpdates: order } = payload;
            const { input } = variables;
            const { user } = context;
            const id = user.id;
            if (order.driverId !== id && order.customerId !== id && order.restaurant.ownerId !== user.id) return false;
            return order.id === input.id;
        }
    })
    @Role(['Any'])
    orderUpdates(@Args('input') input: OrderUpdateInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }


    @Mutation(returns => TakeOrderOutput)
    @Role(['Delivery'])
    async takeOrder(
        @AuthUser() driver: User,
        @Args('input') input: TakeOrderInput
    ): Promise<TakeOrderOutput> {
        return this.orders.takeOrder(driver, input);
    }



}