// Holds the user's products along with their quantity they bought
export interface Items {
    _id: string
    price: number
    product_name: string
    quantity: number
    product_images: string[]
}

// Purchases holds array of products along with their purchase data and total price
export interface Purchases {
    _id: string
    items: Items[]
    purchased_at: Date
    totalPrice: number
}

// Holds a user and all their purchases
export interface History {
    _id: string
    user: string
    purchases: Purchases[]
}