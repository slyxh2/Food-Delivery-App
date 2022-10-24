import { InputType, PickType, PartialType, ObjectType, Field } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Dish } from "../entities/dish.entity";




@InputType()
export class EditDishInput extends PickType(PartialType(Dish), ["name", "options", "price", "description", "photo"]) {
    @Field(type => Number)
    dishId: number;
}



@ObjectType()
export class EditDishOutput extends MutationOutput { }