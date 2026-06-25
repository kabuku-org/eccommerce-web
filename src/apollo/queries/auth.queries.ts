import { gql } from '@apollo/client'
import type { User } from '../../types/user.types'

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
    
      user{
        id
        name
        email
        role
      }
      
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

export type RegisterResponse = {
  register: User
}

export type LoginResponse = {
  login: {
    token: string
    user: User
  }
}

export type MeResponse = {
  me: User
}