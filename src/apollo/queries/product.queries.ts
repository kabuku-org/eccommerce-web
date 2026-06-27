import {gql} from '@apollo/client'
import type { Product } from '../../types/product.types'

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stock
      imageUrl
      
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      imageUrl
      
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      stock
      imageUrl
      createdAt
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productId: String!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      id
      name
      description
      price
      stock
      imageUrl
      createdAt
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`

export type GetProductsResponse = {
  products: Product[]
}

export type GetProductResponse = {
  product: Product
}

export type CreateProductResponse = {
  createProduct: Product
}

export type UpdateProductResponse = {
  updateProduct: Product
}

export type DeleteProductResponse = {
  deleteProduct: boolean
}