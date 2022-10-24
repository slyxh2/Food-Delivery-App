import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Dish } from "../entities/dish.entity";




@InputType()
@ObjectType()
export class CreateDishInput extends PickType(Dish, ['name', 'price', 'description', 'options']) {
    @Field(type => Number)
    restaurantId: number;
}


@ObjectType()
export class CreateDishOutput extends MutationOutput { }