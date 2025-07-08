import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Hook for retrieving one product from DB
export const useFetchProduct = (productId: string) => {
    const [product, setProduct] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProduct = useCallback(async (): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/products/${productId}`)

            if (!res.data || res.data.length === 0) {
                setError(res.data.errorMessage)
                return
            }

            setProduct(res.data)
        }
        catch (err: any) {
            setError(err.response.data.errorMessage)
        }
        finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProduct()
    }, []) 

    return { product, loading, error, fetchProduct }
}