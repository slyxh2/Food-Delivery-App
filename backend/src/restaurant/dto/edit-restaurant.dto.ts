import { Field, InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Restaurant } from "../entities/restaruant.entity";



@InputType()
export class EditRestaurantInput extends PartialType(
    PickType(Restaurant, ["name", "coverImg", "adress"], InputType)
) {
    @Field(type => String, { nullable: true })
    categoryName?: string

    @Field(type => Number)
    restaurantId: number
}


@ObjectType()
export class EditRestaurantOutput extends MutationOutput { }