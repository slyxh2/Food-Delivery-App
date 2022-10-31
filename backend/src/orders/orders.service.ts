import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Restaurant } from "src/restaurant/entities/restaruant.entity";
import { User, UserRole } from "src/users/entities/users.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetSingleOrderInput, GetSingleOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order, OrderStatus } from "./entities/order.entity";



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

    async getOrders(user: User, input: GetOrdersInput): Promise<GetOrdersOutput> {
        try {
            const { role, id: userId } = user;
            const { status } = input
            let orders: Order[];
            if (role === UserRole.Client) {
                orders = await this.orders
                    .createQueryBuilder('orders')
                    .leftJoinAndSelect('orders.customer', 'customer')
                    .where("customer.id=:id", { id: userId })
                    .getMany();

            } else if (role === UserRole.Delivery) {
                orders = await this.orders
                    .createQueryBuilder('orders')
                    .leftJoinAndSelect('orders.driver', 'driver')
                    .where("driver.id=:id", { id: userId })
                    .getMany()

            } else if (role === UserRole.Owner) {
                orders = [];
                const restaurants = await this.restaurants
                    .createQueryBuilder('restaurant')
                    .leftJoinAndSelect('restaurant.owner', 'owner')
                    .where('owner.id=:id', { id: userId })
                    .leftJoinAndSelect('restaurant.orders', 'orders')
                    .getMany();
                restaurants.forEach(restaurant => {
                    restaurant.orders.forEach(order => {
                        orders.push(order);
                    })
                })
                if (status) orders = orders.filter(order => order.status === status);
                console.log(orders);
            }
            return { ok: true, orders }
        } catch (err) {
            return { ok: false, error: 'can not get orders' };
        }

    }

    async getSingleOrder(user: User, input: GetSingleOrderInput): Promise<GetSingleOrderOutput> {
        try {
            const { id: orderId } = input;
            const order = await this.orders.findOne({
                where: { id: orderId },
                relations: ['restaurant']
            });
            if (!order) return { ok: false, error: "order was nor found" };
            if (!this.canSeeOrder(user, order)) return { ok: false, error: "You can't see the order" };

            return { ok: true, order };
        } catch (err) {
            return { ok: false, error: "order was nor found" };
        }

    }
    async editOrder(user: User, input: EditOrderInput): Promise<EditOrderOutput> {
        try {
            const { id: orderId, status } = input;
            const order = await this.orders.findOne({
                where: { id: orderId },
                relations: ['restaurant']
            });
            if (!order) return { ok: false, error: "order was not found" };
            if (!this.canSeeOrder(user, order)) return { ok: false, error: "can't edit the order" };
            let canEdit = true;
            if (user.role === UserRole.Client) {
                canEdit = false;
            }
            if (user.role === UserRole.Owner) {
                if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }
            if (user.role === UserRole.Delivery) {
                if (
                    status !== OrderStatus.PickedUp &&
                    status !== OrderStatus.Delivered
                ) {
                    canEdit = false;
                }
            }
            if (!canEdit) {
                return {
                    ok: false,
                    error: "You can't do that.",
                };
            }
            await this.orders.save({
                id: orderId,
                status
            });
            return { ok: true };
        } catch (error) {
            return { ok: false, error }
        }

    }

    private canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role === UserRole.Client && order.customerId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Delivery && order.driverId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
            canSee = false;
        }
        return canSee;
    }
}