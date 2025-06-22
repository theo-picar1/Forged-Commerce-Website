import { Product } from "./Product"

export interface Favourite {
    userId: string,
    favourites: Product[]
}