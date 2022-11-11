import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { TOKEN_KEY } from './common/conts';
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(TOKEN_KEY);

export const isLogged = makeVar(Boolean(token));
export const authToken = makeVar(token);

console.log(authToken());

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            "x-jwt": authToken() || "",
        },
    };
});

const httpLink = createHttpLink({
    uri: 'http://localhost:1000/graphql',
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
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