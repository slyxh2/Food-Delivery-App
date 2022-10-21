import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Restaurant } from "../entities/restaruant.entity";




@InputType()
export class FindRestaurantByIdInput {
    @Field(type => Number)
    restaurantId: number
}

@ObjectType()
export class FindRestaurantByIdOutput extends MutationOutput {
    @Field(type => Restaurant, { nullable: true })
    restaurant?: Restaurant
}