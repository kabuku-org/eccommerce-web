import {gql} from '@apollo/client';
import type {CartItem} from '../../types/cart.types'

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
mutation AddToCart($productId: String!) {
  addToCart(productId: $productId) {
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
    product_id: string;
    quantity: number;
    price: number;
    name: string;
}

export type CartData = {
  id: string;
  user_id: string;
  items: CartItemData[];
  total: number;
}

export type GetMyCartResponse = {
  myCart: CartData
}

export type AddToCartResponse = {
  addToCart: CartData
}

export type RemoveFromCartResponse = {
  removeFromCart: CartData
}

export type ClearCartResponse = {
  clearCart: CartData
}   