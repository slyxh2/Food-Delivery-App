import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { Restaurant } from "../entities/restaruant.entity";



@InputType()
export class RestaurantInput extends PaginationInput { }


@ObjectType()
export class RestaurantOutput extends PaginationOutput {
    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[];
}