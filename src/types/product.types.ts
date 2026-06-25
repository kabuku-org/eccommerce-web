export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  created_at: string
}

export type CreateProductInput = {
    name: string  
    description: string
    price: number
    stock: number
    image_url: string
}

export type UpdateProductInput = {
    name?: string  
    description?: string
    price?: number
    stock?: number
    image_url?: string
}