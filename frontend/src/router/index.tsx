import React from "react";
import { useReactiveVar } from "@apollo/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import { isLogged } from "../appollo";
import { NotFound } from "../pages/404";
import { Login } from "../pages/login";
import { CreateAccount } from "../pages/create-account";
import '../styles/tailwind.css';

let logInRouter: RouteObject[] = [
    {
        path: '/',
        element: <NotFound />
    }
];
let logOutRouter: RouteObject[] = [
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/create-account',
        element: <CreateAccount />
    }
];
export const MainRouter = () => {
    const logFlag = useReactiveVar(isLogged);
    const router = createBrowserRouter(logFlag ? logInRouter : logOutRouter);
    return <>
        <RouterProvider router={router} />
    </>
}