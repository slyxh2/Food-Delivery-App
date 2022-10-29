import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Restaurant } from "src/restaurant/entities/restaruant.entity";
import { User } from "src/users/entities/users.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";



@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    ) { }

    async createOrder(
        customer: User,
        input: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        try {
            const { restaurantId, items } = input;
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId }
            });
            if (!restaurant) return { ok: false, error: 'Restaurant was not found' };
            let orderFinalPrice = 0;
            let orderItems: OrderItem[] = [];
            for (let item of items) {
                const dish = await this.dishes.findOne({
                    where: { id: item.dishId }
                });
                if (!dish) {
                    return { ok: false, error: "Dish not found" }
                }
                let dishFinalPrice = dish.price;
                for (let itemOption of item.options) {
                    const dishOption = dish.options.find(dishOption => dishOption.name === itemOption.name);
                    if (dishOption) {
                        if (dishOption.extra) {
                            dishFinalPrice += dishOption.extra
                        } else {
                            const dishOptionChoice = dishOption.choices.find(optionChoice => optionChoice.name === itemOption.choice);
                            dishFinalPrice += dishOptionChoice.extra
                        }
                    }
                }
                orderFinalPrice += dishFinalPrice;
                const orderItem = await this.orderItems.save(
                    this.orderItems.create(
                        {
                            dish,
                            options: item.options
                        }
                    )
                );
                orderItems.push(orderItem);
            }
            console.log(orderFinalPrice);

            const order = await this.orders.save(
                this.orders.create(
                    {
                        customer,
                        restaurant,
                        total: orderFinalPrice,
                        items: orderItems
                    }
                )
            );
            return { ok: true };
        } catch (error) {
            return { ok: false, error: "Can not create dish" };
        }

    }
}