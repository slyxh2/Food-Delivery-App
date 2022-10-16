import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Verification } from "../entities/verification.entity";


@ObjectType()
export class VerifyEmailOutput extends MutationOutput { }


@ObjectType()
@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) { }