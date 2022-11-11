import React from "react";
import { useReactiveVar } from "@apollo/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import { isLogged } from "../appollo";
import { NotFound } from "../pages/404";
import { Login } from "../pages/login";
import { CreateAccount } from "../pages/create-account";
import '../styles/tailwind.css';
import { Restaurant } from "../pages/client/restaurant";
import { Root } from '../components/root';
import { useMe } from "../common/hooks/useMe";
import { UserRole } from "../types/globalTypes";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const publicRoutes: RouteObject[] = [
    {
        path: 'confirm',
        element: <ConfirmEmail />,
        loader: ({ request }) => {
            const url = new URL(request.url);
            const searchTerm = url.searchParams.get("code");
            return searchTerm;
        }
    },
    {
        path: 'edit-profile',
        element: <EditProfile />
    }
];

const clientRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            ...publicRoutes
        ]
    },

];
const ownerRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            ...publicRoutes
        ]
    },
];
const driverRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            ...publicRoutes
        ]
    },
];


const logOutRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: '',
                element: <Restaurant />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'create-account',
                element: <CreateAccount />
            }
        ]
    },
];

type roleInput = UserRole.Client | UserRole.Delivery | UserRole.Owner | undefined;
const getRouteObj = (role: roleInput): RouteObject[] => {
    if (role === UserRole.Client) return clientRoutes;
    if (role === UserRole.Owner) return ownerRoutes;
    return driverRoutes;
}

export const MainRouter = () => {
    const logFlag = useReactiveVar(isLogged);
    let routes: RouteObject[] = [];
    const { data, loading, error } = useMe();
    if (logFlag) {
        routes = getRouteObj(data?.me.role);
    } else {
        routes = logOutRoutes;
    }

    return <>
        <RouterProvider router={createBrowserRouter(routes)} />
    </>
}