import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "src/common/dto/output.dto";
import { Payment } from "../entities/payment.entity";




@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId']) {
    @Field(type => Number)
    restaurantId: number;
}


@ObjectType()
export class CreatePaymentOutput extends MutationOutput { }