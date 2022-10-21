import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";



@InputType()
export class DeleteRestaruantInput {
    @Field(type => Number)
    restaurantId: number
}

@ObjectType()
export class DeleteRestaruantOutput extends MutationOutput { }