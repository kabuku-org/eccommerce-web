import {gql} from '@apollo/client'

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    allReviews {
      id
      productId
      userId
      orderId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    productReviews(productId: $productId) {
      id
      productId
      userId
      orderId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
      productId
      userId
      orderId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`

export type ReviewType = {
  id: string
  productId: string
  userId: string
  orderId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export type GetAllReviewsResponse = {
  allReviews: ReviewType[]
}

export type GetProductReviewsResponse = {
  productReviews: ReviewType[]
}

export type CreateReviewResponse = {
  createReview: ReviewType
}

export type ReviewInputType = {
  productId: string
  orderId: string
  rating: number
  comment: string
}