import { Product } from "./Product"

export interface Items {
    price: number
    product_name: string
    quantity: number
    product_images: string[]
}

export interface Purchases {
    _id: string
    items: Items[]
    purchased_at: Date
}

export interface History {
    _id: string
    user: string
    purchases: Purchases[]
}