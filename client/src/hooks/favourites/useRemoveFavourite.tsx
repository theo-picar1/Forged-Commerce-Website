import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// For deleting a product from user's favourites
export const useRemoveFavourite = () => {
    // State variables
    const [favourites, setFavourites] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const removeFromFavourites = async (userId: string, productId: string): Promise<void> => {
        if(!productId || !userId) return

        setLoading(true)
        setError(null)

        try {
            const res = await axios.delete(`${SERVER_HOST}/favourites/${userId}/${productId}`)

            if (!res.data || !res) {
                return
            }
            
            setFavourites(res.data.favourites)

            return
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

    return { favourites, loading, error, removeFromFavourites }
}