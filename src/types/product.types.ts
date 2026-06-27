export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  createdAt: string
}

export type CreateProductInput = {
    name: string  
    description: string
    price: number
    stock: number
    imageUrl?: string
}

export type UpdateProductInput = {
    name?: string  
    description?: string
    price?: number
    stock?: number
    imageUrl?: string
}