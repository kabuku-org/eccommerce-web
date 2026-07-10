export type orderItem = {
  productId: string
  quantity: number
  price: number
}

export type order = {
  id: string
  userId: string
  cart: orderItem[]
  totalAmount: number
    status: 'pending' | 'completed' | 'cancelled'
    createdAt: string
    updatedAt: string
}