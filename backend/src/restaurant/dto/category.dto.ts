import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { Category } from "../entities/category.entity";
import { Restaurant } from "../entities/restaruant.entity";


@InputType()
export class FindCategoryBySlugInput extends PaginationInput {
    @Field(type => String)
    slug: string;
}

@ObjectType()
export class FindCategoryBySlugOutput extends PaginationOutput {
    @Field(type => Category, { nullable: true })
    category?: Category;

    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[];

}