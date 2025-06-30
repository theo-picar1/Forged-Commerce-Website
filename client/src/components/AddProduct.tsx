import React, { useState } from "react"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Product } from "../types/Product"

interface AddProductProps {
    closeSlideInModal: (modalToClose: string) => void
}

const AddProduct: React.FC<AddProductProps> = ({
    closeSlideInModal
}) => {
    const [productToAdd, setProductToAdd] = useState<Product| null>(null)

    return (
        <div className="crud-modal" id="add-product-modal">
            <div className="crud-modal-content">
                <p onClick={() => closeSlideInModal("add-product-modal")}>Hello</p>
            </div>
        </div>
    )
}

export default AddProduct