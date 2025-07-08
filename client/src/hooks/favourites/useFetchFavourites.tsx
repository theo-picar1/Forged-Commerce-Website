import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Fetch user's favourites or create new collection for user if not created yet
export const useFetchFavourites = (userId: string) => {
    // State variables
    const [favourites, setFavourites] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchFavourites = useCallback(async (): Promise<void> => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/favourites/${userId}`)

            if (!res || !res.data) {
                return
            }

            setFavourites(res.data.favourites) // Get users favourites and corresponding id
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
        fetchFavourites()
    }, [fetchFavourites])

    return { favourites, loading, error, fetchFavourites }
}