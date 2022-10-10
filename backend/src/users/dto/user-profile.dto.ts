import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { User } from "../entities/users.entity";



@InputType()
export class UserProfileInput {
    @Field(type => Number)
    userId: number;
}


@ObjectType()
export class UserProfileOutput extends MutationOutput {
    @Field(type => User, { nullable: true })
    user?: User
}