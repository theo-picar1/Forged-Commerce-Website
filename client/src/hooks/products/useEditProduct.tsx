import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Hook for retrieving one product from DB
export const useEditProduct = () => {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const editProduct = async (productId: string, formData: FormData): Promise<void> => {
        if(!formData || !productId) return
        
        setLoading(true)
        setError(null)

        try {
            const res = await axios.put(`${SERVER_HOST}/products/${productId}`, formData)

            if (!res.data || res.data.length === 0) {
                setError(res.data.errorMessage)
                return
            }

            setProduct(res.data)

            console.log(res.data)
        }
        catch (err: any) {
            setError(err.response.data.errorMessage)
        }
        finally {
            setLoading(false)
        }
    }

    return { product, loading, error, editProduct }
}