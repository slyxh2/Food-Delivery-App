import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurant/entities/restaruant.entity";
import { User } from "src/users/entities/users.entity";
import { LessThan, Repository } from "typeorm";
import { CreatePaymentInput, CreatePaymentOutput } from "./dto/create-payment.dto";
import { GetPaymentsOutput } from "./dto/get-payments.dto";
import { Payment } from "./entities/payment.entity";
import { SchedulerRegistry, Interval } from '@nestjs/schedule';


@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment) private readonly payments: Repository<Payment>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        private schedulerRegistry: SchedulerRegistry
    ) { }

    async createPayment(authUser: User, input: CreatePaymentInput): Promise<CreatePaymentOutput> {
        try {
            const { restaurantId, transactionId } = input;
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId }
            });
            if (!restaurant) return { ok: false, error: 'Restaurant was not found' };
            if (restaurant.ownerId !== authUser.id) return { ok: false, error: 'You are not allowed to do this' };
            restaurant.isPromoted = true;
            const date = new Date();
            date.setDate(date.getDate() + 7);
            restaurant.promotedUntil = date;
            await this.restaurants.save(restaurant);
            await this.payments.save(
                this.payments.create({
                    transactionId,
                    user: authUser,
                    restaurant
                })
            )
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }

    async getPayments(user: User): Promise<GetPaymentsOutput> {
        try {
            const result = await this.payments.createQueryBuilder('payments')
                .leftJoinAndSelect('payments.user', 'user')
                .where("user.id=:id", { id: user.id })
                .getMany();
            return { ok: true, payments: result };
        } catch (error) {
            return { ok: false, error };
        }
    }

    @Interval(2000)
    async checkPromoted() {
        const restaurants = await this.restaurants.find({
            where: {
                isPromoted: true,
                promotedUntil: LessThan(new Date())
            }
        });
        restaurants.forEach(async restaurant => {
            restaurant.isPromoted = false;
            restaurant.promotedUntil = null;
            await this.restaurants.save(restaurant);
        })
    }
}