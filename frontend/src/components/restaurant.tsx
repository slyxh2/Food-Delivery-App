import React from "react";
import { Link } from "react-router-dom";
import { restaurantsPageQuery_restaurants_restaurants } from "../types/restaurantsPageQuery";

interface Restaurant extends restaurantsPageQuery_restaurants_restaurants { };
interface RestaurantTabProps {
    restaurant: Restaurant
}

export const RestaurantTab: React.FC<RestaurantTabProps> = (props: RestaurantTabProps) => {
    const { id, coverImg, name, category } = props.restaurant;
    return <div>
        <Link to={`/restaurants/${id}`}>
            <div className="flex flex-col">
                <div
                    style={{ backgroundImage: `url(${coverImg})` }}
                    className="bg-cover bg-center mb-3 py-28"
                ></div>
                <h3 className="text-xl">{name}</h3>
                <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
                    {category?.name}
                </span>
            </div>
        </Link>
    </div>
}