import React from "react";
import { Link } from "react-router-dom";
import { restaurantsPageQuery_allCategories_categories } from "../types/restaurantsPageQuery";

interface Category extends restaurantsPageQuery_allCategories_categories { }

interface CategoryTabProps {
    category: Category
}
export const CategoryTab: React.FC<CategoryTabProps> = (props: CategoryTabProps) => {
    const { id, slug, coverImg, name } = props.category;
    return <div>
        <Link key={id} to={`/category/${slug}`}>
            <div className="flex flex-col group items-center cursor-pointer">
                <div
                    className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                    style={{ backgroundImage: `url(${coverImg})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium">
                    {name}
                </span>
            </div>
        </Link>
    </div>
}