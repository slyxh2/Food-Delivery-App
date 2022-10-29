import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { DishOption } from "src/restaurant/entities/dish.entity";
import { OrderItemOption } from "../entities/order-item.entity";
import { Order } from "../entities/order.entity";



@InputType()
class CreateOrderItemInput {
    @Field(type => Number)
    dishId: number;

    @Field(type => [OrderItemOption], { nullable: true })
    options?: OrderItemOption[]
}

@InputType()
@ObjectType()
export class CreateOrderInput {
    @Field(type => Number)
    restaurantId: number;

    @Field(type => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends MutationOutput { }