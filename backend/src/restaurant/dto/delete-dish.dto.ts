import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";




@InputType()
export class DeleteDishInput {
    @Field(type => Number)
    dishId: number;
}


@ObjectType()
export class DeleteDishOutput extends MutationOutput { }