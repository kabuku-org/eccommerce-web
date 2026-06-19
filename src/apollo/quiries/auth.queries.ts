import { gql } from '@apollo/client'

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      name
      email
      role
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`