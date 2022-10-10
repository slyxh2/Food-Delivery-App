import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { User } from "../entities/users.entity";



@ObjectType()
export class EditProfileOutput extends MutationOutput {

}

@ObjectType()
@InputType()
export class EditProfileInput extends PartialType(PickType(User, ["email", 'password'])) { }