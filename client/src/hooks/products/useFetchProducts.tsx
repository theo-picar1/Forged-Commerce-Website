/* 
    IMPORTANT 
    You want to configure the hook itself 
        -> Pass as parameters to the hook function (export const useXyz = (...) =>)
    You want to pass event data like an ID when invoking a returned function
        -> Pass to the returned function inside the hook
*/

import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Hook for retrieving all products from DB
export const useFetchProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // useCallback wrapper to prevent re-renders
    const fetchProducts = useCallback(async (): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/products`)

            if (!res.data || res.data.length === 0) {
                setError(res.data.errorMessage)
                return
            }

            setProducts(res.data)
        }
        catch (err: any) {
            setError(err.response.data.errorMessage)
        }
        finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, []) 

    return { products, loading, error, refetch: fetchProducts }
}
