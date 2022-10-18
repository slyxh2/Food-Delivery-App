import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";
import { Restaurant } from 'src/restaurant/entities/restaruant.entity';

export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery'
}

registerEnumType(UserRole, { name: "UserRole" });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({ select: false })
    @Field(type => String)
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(type => Restaurant, restaurant => restaurant.owner)
    restaurants: Restaurant[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }


    }

    async checkPassword(input: string): Promise<boolean> {
        try {
            return await bcrypt.compare(input, this.password);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

}