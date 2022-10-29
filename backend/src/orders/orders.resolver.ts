import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";



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
}