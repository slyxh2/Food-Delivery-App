import React from "react";
import { restaurantsPageQuery_restaurants_restaurants } from "../types/restaurantsPageQuery";
import { RestaurantTab } from "./restaurant";


interface Restaurant extends restaurantsPageQuery_restaurants_restaurants { };

interface RestaurantListProps {
    restaurants: Restaurant[],
    index: number
}
const List: React.FC<RestaurantListProps> = (props) => {
    const { restaurants, index } = props;
    console.log(index);
    return <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10 pb-20">
        {
            restaurants?.map((restaurant) => (<RestaurantTab restaurant={restaurant} key={restaurant.id} />))
        }
    </div>
}
const isUpdate = (prev: RestaurantListProps, curr: RestaurantListProps): boolean => {
    const { index: prevIndex } = prev;
    const { index: currIndex } = curr;
    console.log(prevIndex, currIndex);
    return prevIndex !== currIndex;
}
export const RestaurantList = React.memo(List, (prev, curr) => {
    console.log('dwadwa');
    return true
});