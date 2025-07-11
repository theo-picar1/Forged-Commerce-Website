import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// For posting a user's cart to their purchase history
export const useCheckoutCart = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const checkoutCart = async (userId: string, cartId: string, totalPrice: number): Promise<void> => {
        if(!userId) return // User is not signed in 
        
        setLoading(true)
        setError(null)

        try {
            const res = await axios.post(`${SERVER_HOST}/purchases/${userId}/${cartId}/${totalPrice}`)

            if(!res || !res.data) {
                return
            }

            console.log("Checked out items")
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

    return { loading, error, checkoutCart }
}