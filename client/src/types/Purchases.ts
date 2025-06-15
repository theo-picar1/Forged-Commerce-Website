import { Cart } from "./Cart"

export interface Purchases {
    cart: Cart
    purchased_at: Date
}

export interface History {
    _id: string
    user: string
    purchases: Purchases[]
}