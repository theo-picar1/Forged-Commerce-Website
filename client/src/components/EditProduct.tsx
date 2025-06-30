import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Product } from "../types/Product"

const EditProduct: React.FC = () => {
    // ID url parameter
    const { id } = useParams<{id: string}>()

    // State variables
    const [product, setProduct] = useState<Product | null>(null)
    const [editedProduct, setEditedProduct] = useState<Product | null>(null)

    // Fetching the product based on id passed in through URL
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${SERVER_HOST}/products/${id}`)

                if(res) {
                    setProduct(res.data)
                }
            }
            catch(error: any) {
                if(error.response.data.errorMessage) {
                    console.error(`Edit product error: ${error.response.data.errorMessage}`)
                }
                else {
                    console.error(`Unexpected edit product error: ${error}`)
                }
            }
        }

        fetchProduct()
    }, [])

    return (
        <div className="edit-product-page">
            <p>{product?.product_name}</p>
        </div>
    )
}

export default EditProduct