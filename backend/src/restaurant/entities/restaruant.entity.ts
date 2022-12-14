import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/users.entity";

import { Column, Entity, ManyToOne, RelationId, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { Dish } from "./dish.entity";

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string

    @Field(type => String, { nullable: true })
    @Column()
    @IsString()
    adress?: string;

    @Field(type => Category, { nullable: true })
    @ManyToOne(type => Category, category => category.restaurant, { nullable: true, onDelete: 'SET NULL', eager: true })
    category?: Category;

    @Field(type => User)
    @ManyToOne(type => User, user => user.restaurants, { onDelete: 'CASCADE' })
    owner: User;

    @Field(type => [Order], { nullable: true })
    @OneToMany(type => Order, order => order.restaurant, { nullable: true })
    orders?: Order[];

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => [Dish])
    @OneToMany(type => Dish, dish => dish.restaurant)
    menu: Dish[];

    @Field(type => Boolean)
    @Column({ default: false })
    isPromoted: boolean;

    @Field(type => Date, { nullable: true })
    @Column({ nullable: true })
    promotedUntil: Date;

}