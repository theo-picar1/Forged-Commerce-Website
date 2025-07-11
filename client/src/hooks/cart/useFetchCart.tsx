import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Cart } from '../../types/Cart'

// For fetching user's cart data
export const useFetchCart = (userId: string, isAdmin: boolean) => {
    const [cart, setCart] = useState<Cart>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCart = useCallback(async (): Promise<void> => {
        if(!userId || isAdmin) return // User is not signed in or an admin is signed in
        
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/cart/${userId}`)

            if (!res || !res.data) {
                return
            }
            else {
                setCart(res.data)
            }

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                setError(error.response.data.errorMessage)
            }
            else {
                setError(error)
            }

            return
        }
        finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    return { cart, loading, error, fetchCart }
}