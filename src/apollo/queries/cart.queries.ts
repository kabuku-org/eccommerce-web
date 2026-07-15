import {gql} from '@apollo/client'


export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      userId
      items {
        productId
        quantity
        price
        name
      }
      total
    }
  }
`

export const ADD_TO_CART = gql`
mutation AddItemToCart($productId: String!) {
  addItemToCart(productId: $productId) {
    id
    userId
    items {
      productId
      quantity
      price
      name
    }
    total
  }
}
`

export const REMOVE_FROM_CART = gql`
mutation RemoveFromCart($productId: String! , $total: Float!) {
  removeFromCart(productId: $productId, total: $total ) {
    id
    userId
    items {
      productId
      quantity
      price
      name
    }
    total
  }
}
`   

export const CLEAR_CART = gql`
mutation ClearCart {
  clearCart {
    id
    userId
    items {
      productId
      quantity
      price
      name
    }
    total
  }
}
`

//resonse types for the queries and mutations

export type CartItemData = {
    productId: string;
    quantity: number;
    price: number;
    name: string;
}

export type CartData = {
  id: string;
  userId: string;
  items: CartItemData[];
  total: number;
}

export type GetMyCartResponse = {
  myCart: CartData
}

export type AddItemToCartResponse = {
  addItemToCart: CartData
}

export type RemoveFromCartResponse = {
  removeFromCart: CartData
}

export type ClearCartResponse = {
  clearCart: CartData
}