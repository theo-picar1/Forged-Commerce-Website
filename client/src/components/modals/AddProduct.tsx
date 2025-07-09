import React, { useState, useRef, useEffect, useReducer } from "react"

// axios
import axios from "axios"
import { SERVER_HOST } from "../../config/global_constants"

// fuctions
import { capitiliseString } from "../../utils/string-utils"
import { closeSlideInModal } from "../../utils/dom-utils"

// Form state 
type FormState = {
    product_name: string
    description: string
    price: number
    discount: number
    stock_quantity: number
    brand_new: boolean
}

// Define form actions
type FormAction = | {
    type: 'UPDATE_FIELD'; field: keyof FormState; value: string | number | boolean
} | {
    type: 'RESET_FORM'
}

// Props being passed to this component
interface AddProductProps {
    categories: string[]
    addAndUpdateProducts: (formData: FormData) => Promise<void>
}

const AddProduct: React.FC<AddProductProps> = ({
    categories,
    addAndUpdateProducts
}) => {
    // Initial values for FormState
    const initialState: FormState = {
        product_name: "",
        description: "string",
        price: 1,
        discount: 0,
        stock_quantity: 1,
        brand_new: false
    }

    // Handle FormState variables
    const formReducer = (state: FormState, action: FormAction): FormState => {
        switch (action.type) {
            // Update field that user is typing in
            case 'UPDATE_FIELD':
                return {
                    ...state,
                    [action.field]: action.value
                }
            // Reset to intiial values
            case 'RESET_FORM':
                return initialState
            default:
                return state
        }
    }

    // Update states with this
    const [state, dispatch] = useReducer(formReducer, initialState)

    // Handle and update corresponding fields 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const parsedValue = type === 'number' ? Number(value) : value

        dispatch({
            type: 'UPDATE_FIELD',
            field: name as keyof FormState,
            value: parsedValue
        })
    }

    // Regular state variables
    const [selectedCategories, setCategories] = useState<string[]>([])
    const [addedImages, setImages] = useState<File[]>([])

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false) // Warning for refreshing during changes

    // If any changes were made upon reload, warn users 
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
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

    // Changes if more than one image. 
    useEffect(() => {
        setHasUnsavedChanges(addedImages.length > 0)
    }, [addedImages])

    // File to open with matching ref value
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Open file with ref on click
    const openFileInput = (): void => {
        fileInputRef.current?.click()
    }

    // To handle all file changes
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    const removeImage = (index: number): void => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // To handle all changes relating to checkboxes
    const handleCheckboxChange = (category: string): void => {
        // Remove if in, add if not in
        setCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    // Create formData object to pass to prop
    const sendFormData = (): void => {
        const formData = new FormData() // To take in any files

        addedImages.forEach(file => {
            formData.append('product_images', file)
        })

        formData.append('product_name', state.product_name)
        formData.append('description', state.description)
        formData.append('categories', JSON.stringify(selectedCategories))
        formData.append('price', state.price.toString())
        formData.append('stock_quantity', state.stock_quantity.toString())
        formData.append('brand_new', state.brand_new.toString())
        formData.append('discount', state.discount.toString())

        addAndUpdateProducts(formData)
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
                        <button onClick={() => sendFormData()}>Submit</button>
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
                            name="product_name"
                            onChange={(e) => handleInputChange(e)}
                            value={state.product_name}
                            autoComplete="off"
                        />

                        <p style={{ fontSize: "12px" }}>{state.product_name.length} / 50</p>
                    </div>

                    <div className="input-container">
                        <b>Description</b>

                        <textarea
                            required
                            placeholder="1000 characters max"
                            onChange={(e) => handleInputChange(e)}
                            autoComplete="off"
                        ></textarea>

                        <p style={{ fontSize: "12px" }}>{state.description.length} / 1000</p>
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
                            value={state.price}
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
                            value={state.discount}
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
                            placeholder="Minimum stock_quantity of 1"
                            name="stock_quantity"
                            onChange={(e) => handleInputChange(e)}
                            value={state.stock_quantity}
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
                                    name="brand_new"
                                    checked={state.brand_new === true}
                                    onChange={() =>
                                        dispatch({ type: 'UPDATE_FIELD', field: 'brand_new', value: true })
                                    }
                                />
                            </div>

                            <div>
                                <p>No</p>

                                <input
                                    type="radio"
                                    name="brand_new"
                                    checked={state.brand_new === false}
                                    onChange={() =>
                                        dispatch({ type: 'UPDATE_FIELD', field: 'brand_new', value: false })
                                    }
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