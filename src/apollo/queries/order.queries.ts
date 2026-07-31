import {gql} from '@apollo/client'

export const CREATE_ORDER = gql`
mutation CreateOrder {
  createOrder {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    createdAt
    updatedAt
  }
}
`

export const GET_MY_ORDERS = gql`
query GetMyOrders {
  myOrders {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    deliveryAddress
    pickupLocation
    createdAt
    updatedAt
  }
}
`

export const CANCEL_ORDER = gql`
mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    createdAt
    updatedAt
  }
}
`

export const CHECKOUT_ORDER = gql`
mutation CheckoutOrder($orderId: String!, $deliveryAddress: String, $pickupLocation: String) {
  checkoutOrder(orderId: $orderId, deliveryAddress: $deliveryAddress, pickupLocation: $pickupLocation) {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    deliveryAddress
    pickupLocation
    createdAt
    updatedAt
  }
}
`

export const GET_ALL_ORDERS = gql`
query GetAllOrders {
  allOrders {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    deliveryAddress
    pickupLocation
    createdAt
    updatedAt
  }
}
`

export const CANCELLED_ORDERS = gql`
query GetCancelledOrders {
  cancelledOrders {
    id
    userId
    cart {
      productId
      quantity
      price
      name
    }
    totalAmount
    status
    createdAt
    updatedAt
  }
}
`

//response types for the above queries and mutations
export type OrderItemInput = {
  productId: string
  quantity: number
  price: number
  name: string
}

// Shared order shape used across all responses
export type OrderResponseShape = {
  id: string
  userId: string
  cart: OrderItemInput[]
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled' | 'shipped' | 'delivered' | 'picked_up'
  deliveryAddress?: string
  pickupLocation?: string
  createdAt: string
  updatedAt: string
}

export type CreateOrderResponse = {
  createOrder: OrderResponseShape
}

export type GetMyOrdersResponse = {
  myOrders: OrderResponseShape[]
}

export type CancelOrderResponse = {
  cancelOrder: OrderResponseShape
}

export type CheckoutOrderResponse = {
  checkoutOrder: OrderResponseShape
}

export type GetAllOrdersResponse = {
  allOrders: OrderResponseShape[]
}