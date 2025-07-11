import { useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Cart } from '../../types/Cart'

// For fetching user's cart data
export const useDeleteProductFromCart = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const deleteProductFromCart = async (userId: string, productId: string): Promise<void> => {
        if(!userId || !productId) return // User is not signed in or no product given
        
        setLoading(true)
        setError(null)

        try {
            const res = await axios.delete(`${SERVER_HOST}/cart/${localStorage.id}/${productId}`)

            if(!res || !res.data) {
                return
            }

            alert("Product removed from cart!")
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

    return { loading, error, deleteProductFromCart }
}