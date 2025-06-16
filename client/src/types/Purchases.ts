import { Product } from "./Product"

export interface Items {
    _id: string
    price: number
    product_name: string
    quantity: number
    product_images: string[]
}

export interface Purchases {
    _id: string
    items: Items[]
    purchased_at: Date
    totalPrice: number
}

export interface History {
    _id: string
    user: string
    purchases: Purchases[]
}