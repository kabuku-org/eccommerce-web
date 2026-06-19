export type Role = 'CUSTOMER' | 'ADMIN'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}