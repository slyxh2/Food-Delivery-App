/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsPageQuery
// ====================================================

export interface restaurantsPageQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsPageQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsPageQuery_allCategories_categories[] | null;
}

export interface restaurantsPageQuery_restaurants_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsPageQuery_restaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsPageQuery_restaurants_restaurants_category | null;
  adress: string | null;
  isPromoted: boolean;
}

export interface restaurantsPageQuery_restaurants {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPage: number | null;
  totalResults: number | null;
  restaurants: restaurantsPageQuery_restaurants_restaurants[] | null;
}

export interface restaurantsPageQuery {
  allCategories: restaurantsPageQuery_allCategories;
  restaurants: restaurantsPageQuery_restaurants;
}

export interface restaurantsPageQueryVariables {
  input?: RestaurantInput | null;
}
