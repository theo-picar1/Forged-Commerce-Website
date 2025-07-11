import { useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Cart } from '../../types/Cart'

// For updating a cart, mainly the quantity of each product
export const useUpdateCartQuantity = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const updateCartQuantities = async (cart: Cart): Promise<void> => {
        if (!cart) return

        const updatedProducts = cart.savedProducts

        try {
            const res = await axios.put(`${SERVER_HOST}/cart/${localStorage.id}`, { products: updatedProducts })

            if(!res || !res.data) {
                return
            }

            console.log("Updated changes to cart")
            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
        finally {
            setLoading(false)
        }
    }

    return { loading, error, updateCartQuantities }
}