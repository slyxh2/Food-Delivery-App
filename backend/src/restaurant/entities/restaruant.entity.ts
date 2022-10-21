import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/users.entity";

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Category } from "./category.entity";

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

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

}