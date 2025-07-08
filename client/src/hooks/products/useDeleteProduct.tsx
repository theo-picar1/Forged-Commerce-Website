import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Hook for retrieving all products from DB
export const useDeleteProduct = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const deleteProduct = useCallback(async (id: string): Promise<void> => {
        if (!id) return

        setLoading(true)
        setError(null)

        try {
            const res = await axios.delete(`${SERVER_HOST}/products/${id}`)

            if (!res || !res.data) {
                setError(res.data.errorMessage)
                console.log(res.data.errorMessage)
            }
            else {
                console.log(res.data.message)
                setProducts(res.data.products)
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
        }
        finally {
            setLoading(false)
        }
    }, [])


    return { products, loading, error, deleteProduct }
}
