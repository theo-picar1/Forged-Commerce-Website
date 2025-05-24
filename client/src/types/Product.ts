export interface Product {
    _id: string
    product_name: string
    product_rating: number
    no_of_reviews: number
    category: string[]
    description: string
    brand_new: boolean
    discount: number
    product_images: string[]
    price: number
    stock_quantity: number
    sold: number
}