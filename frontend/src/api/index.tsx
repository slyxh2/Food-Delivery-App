import { gql } from "@apollo/client";


export const LOGIN_MUTATION = gql`
    mutation LoginMutation($loginInput:LoginInput!){
        login(input:$loginInput){
            ok
            token
            error
        }
    }
`;

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;
