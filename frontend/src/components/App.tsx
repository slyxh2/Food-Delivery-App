import React from "react";
import { MainRouter } from "../router";
import { ApolloProvider } from '@apollo/client';
import { client } from '../appollo';



export const App = () => {
    return <ApolloProvider client={client}>
        <MainRouter />
    </ApolloProvider>
};