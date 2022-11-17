import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { RESTAURANTS_QUERY } from "../../api";
import { CategoryTab } from "../../components/category";
import { restaurantsPageQuery, restaurantsPageQueryVariables, restaurantsPageQuery_restaurants_restaurants } from "../../types/restaurantsPageQuery";
import bg1 from '../../images/bg1.svg';
import bg2 from '../../images/bg2.svg';
import { RestaurantTab } from "../../components/restaurant";
import { RestaurantList } from "../../components/restaurant-list";

interface Restaurant extends restaurantsPageQuery_restaurants_restaurants { };

export const Restaurant = () => {
    const [page, setPage] = useState(1);
    const [restaurantAry, setRestaurant] = useState<any[]>([]);
    // const restaurantAry: any[] = [];
    const onCompleted = (data: restaurantsPageQuery) => {
        console.log(data);
        restaurantAry.push();
        setRestaurant((curr) => [...curr, data.restaurants.restaurants])
    };
    const handleClick = () => {
        setPage((curr) => curr + 1);
    }
    const { data: queryResult, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page
            }
        },
        onCompleted
    });
    return <div>
        <Helmet>
            <title>Home | Nuber Eats</title>
        </Helmet>
        <main className="main-bg flex justify-center items-center">
            <div className="w-full h-full box-border">
                <img className="bg-img-left" src={bg1} />
                <img className="bg-img-right" src={bg2} />
            </div>
            <form
                // onSubmit={handleSubmit(onSearchSubmit)}
                className="z-10 absolute w-5/12 flex justify-between"
            >
                <input
                    name="searchTerm"
                    type="Search"
                    className="input rounded-md border-0 w-8/12"
                    placeholder="Search restaurants..."
                />
                <button className="btn-main">Find Restaurant</button>
            </form>
        </main>

        {
            !loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="flex justify-evenly mx-auto ">
                        {
                            queryResult?.allCategories.categories?.map(item => (<CategoryTab category={item} key={item.id} />))
                        }
                    </div>
                    {/* {

                        restaurantAry.map((restaurantGroup, index) => {
                            return <RestaurantList restaurants={restaurantGroup} index={index} key={index} />
                        })
                    } */}
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10 pb-20">
                        {
                            queryResult?.restaurants.restaurants?.map(item => <RestaurantTab restaurant={item} key={item.id} />)
                        }
                    </div>

                    <div>
                        {
                            page !== queryResult?.restaurants.totalPage ?
                                <button className="btn-main" onClick={handleClick}>Show More</button>
                                :
                                <span>THE END</span>
                        }
                    </div>
                </div>
            )
        }


    </div>

}
