export type orderItem = {
  productId: string
  quantity: number
  price: number
  name: string
}

export type order = {
  id: string
  userId: string
  cart: orderItem[]
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled' | 'shipped' | 'delivered' | 'picked_up'
  deliveryAddress?: string
  pickupLocation?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'shipped' | 'delivered' | 'picked_up'

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'completed', 'shipped', 'delivered', 'cancelled', 'picked_up']

export const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  picked_up: 'bg-purple-100 text-purple-800',
}