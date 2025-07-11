import { Cart } from "../types/Cart"

// Calculate total price from products selected in a user's cart
export function calculateTotalPrice(cart: Cart): number {
    if(!cart || cart.savedProducts === undefined) return 0 

    let total: number = 0

    cart.savedProducts.forEach(savedProduct =>
        total += savedProduct.product.price * savedProduct.quantity
    )

    // €99.99 format
    return parseFloat(total.toFixed(2))
}