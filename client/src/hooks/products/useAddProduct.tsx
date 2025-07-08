import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Add a new product to the current user's products
export const useAddProduct = () => {
    // State variables
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const addToProducts = async (formData: FormData): Promise<void> => {
        if(!formData) return // No formData sent

        setLoading(true)
        setError(null)

        try {
            const res = await axios.post(`${SERVER_HOST}/products`, formData)

            if (!res || !res.data) {
                return
            }

            setProducts(res.data.products)
            setSuccess("Successfully added product!")

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

    return { products, loading, error, addToProducts, success}
}