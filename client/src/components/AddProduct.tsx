import React, { useState, useRef, useEffect } from "react"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Product } from "../types/Product"

// Props being passed to this component
interface AddProductProps {
    closeSlideInModal: (modalToClose: string) => void
    categories: string[]
    capitiliseString: (string: string) => string
}

const AddProduct: React.FC<AddProductProps> = ({
    closeSlideInModal,
    categories,
    capitiliseString
}) => {
    // Input state variables
    const [productName, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [selectedCategories, setCategories] = useState<string[]>([])
    const [price, setPrice] = useState<number>(1)
    const [discount, setDiscount] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1)
    const [brandNew, setBrandNew] = useState<boolean>(true)
    const [addedImages, setImages] = useState<File[]>([])

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false) // To prevent losing progress from accidental progress

    // For activating the notice that will tell users they will lose changes upon reload, only if changes were made 
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload) // Triggers when hitting refresh but just before page actually refreshes

        // Remove the event listener when unmounting the component
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [hasUnsavedChanges])

    // Set true or false on state everytime the images array is modified
    useEffect(() => {
        setHasUnsavedChanges(addedImages.length > 0)
    }, [addedImages])

    // ---------- Image file uploading logic ----------
    // For being able to access file input through some other DOM element
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // To open the file input when clicking on the corresponding DOM element
    const openFileInput = (): void => {
        fileInputRef.current?.click()
    }

    // To handle all file changes
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Code below is to ensure a decent sized image is being uploaded to prevent blurry images
            const img = new Image()
            img.src = URL.createObjectURL(file) // Create an temporarory image object so that I can check its demensions

            // When the image loads, add it if it meets dimension requirements. Otherwise, tell the user to choose a larger image
            img.onload = () => {
                if (img.width >= 600 && img.height >= 600) {
                    setImages(prev => [...prev, file])
                }
                else {
                    alert('Image must be at least 600x600 pixels')
                }

                URL.revokeObjectURL(img.src) // Free up memory
            }

            e.target.value = '' // Allow the same file to be re-selected later
        }
    }

    // To remove an image from the state based on its index
    const removeImage = (index: number) => {
        // Filter out the previous state so that image with the same index is not included
        setImages(prev => prev.filter((_, i) => i !== index))
    }
    // ------------------------------------------------

    // To handle both text and number input changes. 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Determines which state to set based on e.target's name
        switch (name) {
            case "productName":
                setName(value);
                break
            case "price":
                setPrice(Number(value));
                break
            case "discount":
                setDiscount(Number(value));
                break
            case "quantity":
                setQuantity(Number(value));
                break
            case "brandNew":
                setBrandNew(value === "yes");
                break
        }
    }

    // Textarea has to be separate because typescript says so
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        setDescription(value)
    }

    // To handle all changes relating to checkboxes
    const handleCheckboxChange = (category: string) => {
        // If the state array already has passed in value, remove it. Otherwise add it with the other previous elements
        setCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    // When triggered, it will send all the product details to the backend via axios to upload it to database
    const submitProduct = async () => {
        try {
            const formData = new FormData() // Since image files are being taken into account

            addedImages.forEach(file => {
                formData.append('product_images', file)
            })

            formData.append('product_name', productName)
            formData.append('description', description)
            formData.append('categories', JSON.stringify(selectedCategories))
            formData.append('price', price.toString())
            formData.append('stock_quantity', quantity.toString())
            formData.append('brand_new', brandNew.toString())
            formData.append('discount', discount.toString())

            const res = await axios.post(`${SERVER_HOST}/products`, formData)

            if (!res || !res.data) {
                console.log(res.data.errorMessage)
            }
            else {
                alert(res.data.message)
            }

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.log("Add product error: ", error)
            }
        }
    }

    return (
        <div className="crud-modal" id="add-product-modal">
            <div className="crud-modal-content">
                <div className="header">
                    <div className="close" onClick={() => closeSlideInModal("add-product-modal")}>
                        <img src="/images/close-icon.png" />
                    </div>

                    <h4>Add Product</h4>

                    <div className="submit">
                        <button onClick={() => submitProduct()}>Submit</button>
                    </div>
                </div>

                <form>
                    <div className="input-container">
                        <b>Add images</b>

                        <div className="images-container">
                            {addedImages.map((file, index) =>
                                <div className="image" key={index}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />

                                    <div className="remove-button" onClick={() => removeImage(index)}>
                                        <img src="/images/close-icon.png" />
                                    </div>
                                </div>
                            )}

                            <div className="add-image-button" onClick={() => openFileInput()}>
                                <img src="/images/add-icon.png" />
                            </div>

                            <input
                                required
                                type="file"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e)}
                                accept="image/*"
                            />
                        </div>

                        <div className="image-notice">
                            <p style={{ fontSize: "12px" }}>{addedImages.length} / 5 images</p>

                            <p style={{ fontSize: "12px" }}>Minimum 600x600</p>
                        </div>
                    </div>

                    <div className="input-container">
                        <b>Product name</b>

                        <input
                            required
                            type="text"
                            placeholder="50 characters max"
                            className="text-input"
                            name="productName"
                            onChange={(e) => handleInputChange(e)}
                            value={productName}
                            autoComplete="off"
                        />

                        <p style={{ fontSize: "12px" }}>{productName.length} / 50</p>
                    </div>

                    <div className="input-container">
                        <b>Description</b>

                        <textarea
                            required
                            placeholder="1000 characters max"
                            onChange={(e) => handleDescriptionChange(e)}
                            autoComplete="off"
                        ></textarea>

                        <p style={{ fontSize: "12px" }}>{description.length} / 1000</p>
                    </div>

                    <div className="input-container">
                        <b>Categories</b>

                        <div className="categories-container">
                            {categories.map(category =>
                                <label key={category}>
                                    <p>{capitiliseString(category)}</p>

                                    <input
                                        value={category}
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCheckboxChange(category)}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="input-container">
                        <b>Price</b>

                        <input
                            required
                            type="number"
                            placeholder="Minimum price of €1"
                            min="1"
                            className="number-input"
                            name="price"
                            onChange={(e) => handleInputChange(e)}
                            value={price}
                            autoComplete="off"
                        />
                    </div>

                    <div className="input-container">
                        <b>Discount</b>

                        <input
                            required
                            type="number"
                            min="0"
                            max="99"
                            className="number-input"
                            placeholder="Whole numbers only"
                            name="discount"
                            onChange={(e) => handleInputChange(e)}
                            value={discount}
                            autoComplete="off"
                        />
                    </div>

                    <div className="input-container">
                        <b>Quantity</b>

                        <input
                            required
                            type="number"
                            className="number-input"
                            min="1"
                            placeholder="Minimum quantity of 1"
                            name="quantity"
                            onChange={(e) => handleInputChange(e)}
                            value={quantity}
                            autoComplete="off"
                        />
                    </div>

                    <div className="input-container">
                        <b>New</b>

                        <div className="radio-container">
                            <div>
                                <p>Yes</p>

                                <input
                                    type="radio"
                                    name="brandNew"
                                    value="yes"
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>

                            <div>
                                <p>No</p>

                                <input
                                    type="radio"
                                    name="brandNew"
                                    value="no"
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct