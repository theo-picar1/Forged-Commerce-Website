import React, { Component } from "react"
import { Product } from "../types/Product"

interface ShoppingCartProps {
    products: Product[]
    categories: string[]
    capitiliseString: (input: string) => string
}

export default class ShoppingCart extends Component<ShoppingCartProps> {
    render() {
        return (
            <p>Shopping Cart</p>
        )
    }
}
