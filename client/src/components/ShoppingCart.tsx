import React, { ChangeEvent, Component } from "react"
import { Link } from "react-router-dom"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Cart } from "../types/Cart"
import { Product } from "../types/Product"

interface ShoppingCartProps {
    categories: string[]
    capitiliseString: (input: string) => string
    setProductToView: (product: Product) => void
    cart: Cart | null
    loadCart: () => void
}

export default class ShoppingCart extends Component<ShoppingCartProps> {
    // Self-explanatory
    deleteProductFromCart = async (productId: string): Promise<void> => {
        try {
            const res = await axios.delete(`${SERVER_HOST}/cart/${localStorage.id}/${productId}`)

            if (res) {
                alert("Product deleted!")

                this.props.loadCart()
            }
            else {
                alert("Product was not deleted")
            }
        }
        catch(error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    handleQuantityChangeByButton = (productId: string, action: 'add' | 'subtract'): void => {
        const updatedCart = { ...this.props.cart }

        if (!updatedCart || updatedCart === undefined) return

        updatedCart.products = updatedCart.products?.map(cartProducts => {
            if (cartProducts.product._id === productId) {
                const newQuantity = action === 'add' ? cartProducts.quantity + 1 : cartProducts.quantity - 1

                return {
                    ...cartProducts,
                    quantity: Math.max(1, newQuantity) // Prevent going below 1
                }
            }
            return cartProducts
        })

        // Since cart is passed as a prop, you might need to lift state up to allow updating it
        this.setState({ cart: updatedCart })
    }

    render() {
        const { cart, setProductToView } = this.props

        return (
            !cart || cart.products.length === 0 ? (
                <div className="empty-shopping-cart">
                    <h3>Shopping Cart</h3>

                    <h4>You currently have no items in your cart!</h4>

                    <Link to={"/"} className="look-for-items">Look for items!</Link>
                </div>
            ) : (
                <div className="filled-shopping-cart">
                    <div className="top-section">
                        <h3>Shopping Cart</h3>

                        <button className="proceed-to-checkout">Proceed to checkout ({cart.products.length})</button>
                    </div>

                    <div className="cart-products-section">
                        {cart.products.map(cartProduct =>
                            <div className="cart-product" key={cartProduct.product._id}>
                                <div className="product-details">
                                    <div className="left">
                                        <div className="image-container" onClick={() => setProductToView(cartProduct.product)}>
                                            <img src={cartProduct.product.product_images[0]} alt="" />
                                        </div>
                                    </div>

                                    <div className="right">
                                        <p className="product-name">{cartProduct.product.product_name}</p>
                                        <h3 className="product-price">€{cartProduct.product.price}</h3>
                                        <p className="product-stock">{cartProduct.product.stock_quantity} available</p>
                                    </div>
                                </div>

                                <div className="product-buttons">
                                    <div className="edit-quantity-section">
                                        <button className="subtract">-</button>

                                        <input className="quantity" type="text" value={cartProduct.quantity} />

                                        <button className="add">+</button>
                                    </div>

                                    <button className="remove-button" onClick={() => this.deleteProductFromCart(cartProduct.product._id)}>Remove product</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        )
    }
}
