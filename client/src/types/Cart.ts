import { Product } from './Product.ts'

export interface CartProducts {
  product: Product
  quantity: number
}

export interface Cart {
  _id: string
  user: string
  savedProducts: CartProducts[]
}
