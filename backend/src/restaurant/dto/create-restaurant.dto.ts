import { Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Restaurant } from "../entities/restaruant.entity";



@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ["name", "coverImg", "adress"], InputType) {
    @Field(type => String)
    categoryName: string
}


@ObjectType()
export class CreateRestaurantOutput extends MutationOutput { }