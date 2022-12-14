import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { Restaurant } from "../entities/restaruant.entity";



@InputType()
export class SearchRestaurantInput extends PaginationInput {
    @Field(type => String)
    query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[]
}