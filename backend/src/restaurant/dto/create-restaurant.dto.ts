import { Field, InputType, OmitType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaruant.entity";



@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ["id"], InputType) { }