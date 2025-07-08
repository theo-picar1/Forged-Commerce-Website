import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Add a new product to the current user's favourites
export const useAddFavourite = () => {
    // State variables
    const [favourites, setFavourites] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const addToFavourites = async (userId: string, productId: string): Promise<void> => {
        if(!userId || !productId) return

        setLoading(true)
        setError(null)

        try {
            const res = await axios.post(`${SERVER_HOST}/favourites/${userId}/${productId}`)

            if (!res || !res.data) {
                return
            }
            
            setFavourites(res.data.favourites)
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                setError(error.response.data.errorMessage)
            }
            else {
                setError(error)
            }
        }
        finally {
            setLoading(false)
        }
    }

    return { favourites, loading, error, addToFavourites }
}