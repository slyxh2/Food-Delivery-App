import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Order } from "../entities/order.entity";



@InputType()
export class GetSingleOrderInput {
    @Field(type => Number)
    id: number
}

@ObjectType()
export class GetSingleOrderOutput extends MutationOutput {
    @Field(type => Order, { nullable: true })
    order?: Order;
}