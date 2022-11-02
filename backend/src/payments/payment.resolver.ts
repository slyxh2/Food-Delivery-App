import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/users.entity";
import { CreatePaymentInput, CreatePaymentOutput } from "./dto/create-payment.dto";
import { GetPaymentsOutput } from "./dto/get-payments.dto";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";



@Resolver(of => Payment)
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService
    ) { }

    @Mutation(returns => CreatePaymentOutput)
    @Role(['Owner'])
    async createPayment(
        @AuthUser() authUser: User,
        @Args('input') input: CreatePaymentInput
    ): Promise<CreatePaymentOutput> {
        return this.paymentService.createPayment(authUser, input);
    }

    @Query(returns => GetPaymentsOutput)
    @Role(['Owner'])
    async getPayments(@AuthUser() authUser: User): Promise<GetPaymentsOutput> {
        return this.paymentService.getPayments(authUser);
    }
}