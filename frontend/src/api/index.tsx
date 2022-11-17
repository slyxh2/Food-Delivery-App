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

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;



export const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantInput!){
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input:$input){
      ok
      error
      totalPage
      totalResults
      restaurants{
        id
        name
        coverImg
        category{
          name
        }
        adress
        isPromoted
      }
    }
  }
`
