import { useState } from "react"

import axios from "axios"
import { SERVER_HOST } from "../../config/global_constants"

export const useAddProductToCart = (isAdmin: boolean, isGuest: boolean) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const addProductToCart = async (productId: string, quantityToAdd: number): Promise<void> => {
        // Un-logged users and admins cannot use this feature
        if (isAdmin || isGuest) return

        setLoading(true)

        try {
            const productToAdd = {
                productId,
                quantity: quantityToAdd
            }

            const res = await axios.post(`${SERVER_HOST}/cart/${localStorage.id}`, productToAdd)

            if (!res || !res.data) return

            console.log("Product successfully added to cart")

            return
        }
        catch (error: any) {
            if(error.response.data.errorMessage) {
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

    return { addProductToCart }
}