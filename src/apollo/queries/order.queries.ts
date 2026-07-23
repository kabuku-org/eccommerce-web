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
mutation CheckoutOrder($orderId: String!) {
  checkoutOrder(orderId: $orderId) {
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

export type CreateOrderResponse = {
  createOrder: {
    id: string
    userId: string
    cart: OrderItemInput[]
    totalAmount: number
    status: 'pending' | 'completed' | 'cancelled'
    createdAt: string
    updatedAt: string
  }
}

export type GetMyOrdersResponse = {
  myOrders: CreateOrderResponse['createOrder'][]
}

export type CancelOrderResponse = {
  cancelOrder: CreateOrderResponse['createOrder']
}

export type CheckoutOrderResponse = {
  checkoutOrder: CreateOrderResponse['createOrder']
}

export type GetAllOrdersResponse = {
  allOrders: CreateOrderResponse['createOrder'][]
}
