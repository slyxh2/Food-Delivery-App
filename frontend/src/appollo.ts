import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const isLogged = makeVar(false);

export const client = new ApolloClient({
    uri: 'http://localhost:1000/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLogged();
                        }
                    }
                }
            }
        }
    }),
});