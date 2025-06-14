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
    cartLength: number
    updateCartLength: () => void
}

type ShoppingCartState = {
    cart: Cart | null
    originalCart: Cart | null
    changedQuantity: boolean
}

export default class ShoppingCart extends Component<ShoppingCartProps, ShoppingCartState> {
    constructor(props: ShoppingCartProps) {
        super(props)

        this.state = {
            cart: null,
            originalCart: null,
            changedQuantity: false
        }
    }

    // Get cart data first
    componentDidMount(): void {
        this.fetchCart()
    }

    // Function that acts as both a data retriever and an updater
    fetchCart = async (): Promise<void> => {
        // For getting the user's cart items only if the user has logged in
        if (localStorage.id != null || localStorage.id != undefined) {
            try {
                const res = await axios.get<Cart>(`${SERVER_HOST}/cart/${localStorage.id}`)

                if (!res.data || res.data == null) {
                    alert("No matching cart for user found!")
                    return
                }

                localStorage.cartId = res.data._id

                this.setState({
                    cart: res.data,
                    originalCart: res.data
                })
            }
            catch (error) {
                console.error("Id is not defined, I think? ", error)
            }
        }
    }

    // Self-explanatory
    deleteProductFromCart = async (productId: string): Promise<void> => {
        try {
            const res = await axios.delete(`${SERVER_HOST}/cart/${localStorage.id}/${productId}`)

            if (res) {
                alert("Product deleted!")

                this.props.updateCartLength()
                this.fetchCart()
            }
            else {
                alert("Product was not deleted")
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    // Button that will save all quantity changes to all products in the cart by just replacing the old mongo cart products with the newly updated one
    saveEditedQuantity = async (): Promise<void> => {
        if (!this.state.cart) return

        const updatedProducts = this.state.cart.products

        try {
            const res = await axios.put(`${SERVER_HOST}/cart/${localStorage.id}`, { products: updatedProducts })

            if (res) {
                alert("Changes have been successfully saved!")

                this.setState({
                    changedQuantity: false
                }, () => this.fetchCart())
            }
            else {
                alert("Changes were not saved. Please try again!")
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    // Handles requested quantity change when user clicks the add or subtract buttons
    handleQuantityChangeByButton = (product: Product, action: 'add' | 'subtract'): void => {
        const updatedCart = { ...this.state.cart } as Cart

        updatedCart.products = updatedCart.products.map(cartProduct => {
            if (cartProduct.product._id === product._id) {
                let newQuantity = cartProduct.quantity

                // Making sure if user adds it doesn't go above available stock, and it doesn't go below 1 if subtracting
                if (action === 'add' && newQuantity < cartProduct.product.stock_quantity) {
                    newQuantity += 1
                }
                else if (action === 'subtract' && newQuantity > 1) {
                    newQuantity -= 1
                }

                return {
                    ...cartProduct,
                    quantity: newQuantity
                }
            }
            return cartProduct
        })

        // Check for any quantity changes by using some operator which will return true as long as at least one product quantity does not match
        const originalProducts = this.state.originalCart?.products || []
        const edited = updatedCart.products.some(updated =>
            originalProducts.find(original => original.product._id === updated.product._id)?.quantity !== updated.quantity
        )

        this.setState({
            cart: updatedCart,
            changedQuantity: edited
        })
    }

    // To post all items the user has in their cart to their purchase history
    checkoutItems = async (): Promise<void> => {
        if (localStorage.cartId !== undefined || localStorage.cartId !== null) {
            try {
                const res = await axios.post(`${SERVER_HOST}/purchases/${localStorage.id}`)

                if (res) {
                alert("Successfully checked out!")
            }
            else {
                alert("Failed to check out items!")
            }
            }
            catch (error: any) {
                if (error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.error("Unexpected error:", error)
                }
            }
        }
    }

    render() {
        const { setProductToView } = this.props
        const { changedQuantity, cart } = this.state

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

                        <div className="buttons-section">
                            <button className="proceed-to-checkout">Proceed to checkout ({cart.products.length})</button>

                            {changedQuantity ? (
                                <button className="save-changes" onClick={() => this.saveEditedQuantity()}>Save</button>
                            ) : (
                                <button className="disabled-save-changes">Save</button>
                            )}
                        </div>
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
                                        <button className="subtract" onClick={() => this.handleQuantityChangeByButton(cartProduct.product, "subtract")}>-</button>

                                        <input className="quantity" type="text" value={cartProduct.quantity} readOnly />

                                        <button className="add" onClick={() => this.handleQuantityChangeByButton(cartProduct.product, "add")}>+</button>
                                    </div>

                                    <div className="remove-button" onClick={() => this.deleteProductFromCart(cartProduct.product._id)}>
                                        <img src="/images/bin-icon.png" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        )
    }
}
