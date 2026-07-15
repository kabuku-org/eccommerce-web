import {gql} from '@apollo/client'

export const GET_ALL_CUSTOMERS = gql`
  query GetAllCustomers {
    allCustomers {
      id
      name
      email
      role
    }
  }
`

export type CustomerType = {
  id: string
  name: string
  email: string
  role: string
}

export type GetAllCustomersResponse = {
  allCustomers: CustomerType[]
}