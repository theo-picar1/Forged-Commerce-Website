import React, { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from "../../../config/global_constants"

// types
import { Product } from "../../../types/Product"

// functions
import { capitiliseString } from "../../../utils/string-utils"

interface EditProductProps {
    categories: string[]
}

const EditProduct: React.FC<EditProductProps> = ({
    categories
}) => {
    // For the id that is in the URL for EditProduct
    const { id } = useParams<{ id: string }>()

    // State variables
    const [product, setProduct] = useState<Product | null>(null)

    // Input state variables
    const [selectedCategories, setCategories] = useState<string[]>([])
    const [selectedImages, setImages] = useState<(string | File)[]>([])
    const [product_name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [price, setPrice] = useState<number>(1)
    const [discount, setDiscount] = useState<number>(0)
    const [stock_quantity, setQuantity] = useState<number>(1)
    const [brand_new, setBrandNew] = useState<boolean>(true)

    // When component mounts, get the product that matches id in url
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axios.get<Product>(`${SERVER_HOST}/products/${id}`)

                if (res) {
                    const {
                        product_name,
                        description,
                        price,
                        category,
                        product_images,
                        brand_new,
                        stock_quantity
                    } = res.data

                    setProduct(res.data)
                    setName(product_name)
                    setDescription(description)
                    setPrice(price)
                    setCategories(category) 
                    setImages(product_images) 
                    setBrandNew(brand_new) 
                    setQuantity(stock_quantity)
                }
                else {
                    alert("Failed to retrieve product")
                }
            }
            catch (error: any) {
                console.error("Unexpected error:", error)
            }
        }

        fetchProduct()
    }, [id]) // Whenever id changes, run this again. Pretty much reload component

    // For activating the notice that will tell users they will lose changes upon reload, even if no changes were made 
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
        }

        window.addEventListener('beforeunload', handleBeforeUnload) // Triggers when hitting refresh but just before page actually refreshes

        // Remove the event listener when unmounting the component
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [id])

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

    // ---------- Input handlers ----------
    // To handle both text and number input changes. 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Determines which state to set based on e.target's name
        switch (name) {
            case "product_name":
                setName(value);
                break
            case "price":
                setPrice(Number(value));
                break
            case "discount":
                setDiscount(Number(value));
                break
            case "stock_quantity":
                setQuantity(Number(value));
                break
            case "brand_new":
                setBrandNew(value === "yes");
                break
        }
    }

    // Textarea has to be separate because typescript says so
    const handleDescriptionChange = (e: React.FormEvent<HTMLDivElement>) => {
        const value = e.currentTarget.innerText

        setDescription(value)
    }

    // To handle all changes relating to checkboxes
    const handleCheckboxChange = (category: string) => {
        // If the state array already has passed in value, remove it. Otherwise add it with the other previous elements

        console.log(selectedCategories)
        setCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }
    // ----------------------------- 

    const submitProduct = async () => {
        try {
            // For handling file uploads
            const formData = new FormData()

            selectedImages.forEach(image => {
                // To avoid conflicts with images that were either uploaded or the original image URLs that I set
                if (image instanceof File) {
                    formData.append('uploaded_images', image) // Uploaded files
                }
            })

            // Then get the regular web images
            const webImageStrings = selectedImages.filter(img => !(img instanceof File)) as string[]
            formData.append('web_images', JSON.stringify(webImageStrings))

            // Other fields to append
            formData.append('product_name', product_name)
            formData.append('description', description)
            formData.append('categories', JSON.stringify(selectedCategories))
            formData.append('price', price.toString())
            formData.append('stock_quantity', stock_quantity.toString())
            formData.append('brand_new', brand_new.toString())
            formData.append('discount', discount.toString())

            const res = await axios.put(`${SERVER_HOST}/products/${product?._id}`, formData)

            if (!res || !res.data) {
                alert(res.data.errorMessage)
            }
            else {
                alert(res.data.message)
            }

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.error(error.response.data.errorMessage)
            }
            else {
                console.error(error)
            }

            return
        }
    }

    // Same classNames as ViewProduct due to layout being very similar
    return product ? (
        <div className="view-product-page-container">
            {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
                <div className="admin-tools">
                    <Link to={`/product/${id}`} className="edit admin-button">
                        <p>Cancel</p>
                    </Link>

                    <div className="admin-button" onClick={() => submitProduct()}>
                        <p>Save</p>
                    </div>
                </div>
            ) : null}

            <div className="edit-product-images-container">
                {selectedImages.map((image, i) => {
                    // To take into account both url's that were pasted from web and files that were uploaded by the user
                    const isFile = image instanceof File
                    // If it is an uploaded file, create a preview of file, otherwise use the url as normal
                    const src = isFile ? URL.createObjectURL(image)
                        : image.startsWith('http') || image.startsWith('https') ? image : `${SERVER_HOST}/uploads/${image}`

                    return (
                        <div className="image-container" key={i}>
                            <div className="remove-button" onClick={() => removeImage(i)}>
                                <img src="/images/close-icon.png" />
                            </div>

                            <img key={i} src={src} />
                        </div>
                    )
                })}
            </div>

            <button
                className="add-image-button"
                onClick={() => openFileInput()}
            >Add image</button>

            <input
                required
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
                accept="image/*"
            />

            <div className="product-details">
                <input
                    type="text"
                    name="product_name"
                    className="text-and-number-inputs name-input"
                    autoComplete="off"
                    placeholder="Product name here"
                    defaultValue={product.product_name}
                    onChange={(e) => handleInputChange(e)}
                />

                <div className="price-and-stock">
                    <h5>€</h5>

                    <input
                        type="number"
                        name="price"
                        className="text-and-number-inputs price-input"
                        autoComplete="off"
                        placeholder="Price"
                        defaultValue={product.price}
                        onChange={(e) => handleInputChange(e)}
                    />
                </div>

                <div className="product-quantity-container inaccessible">
                    <p>Quantity</p>

                    <input
                        placeholder="Enter quantity here"
                    />
                </div>

                <div className="buttons inaccessible">
                    <button id="buy-now" className="button">
                        Buy now
                    </button>

                    <button id="add-to-basket" className="button">
                        Add to basket
                    </button>

                    <div id="add-to-favourites" className="button not-favourited">
                        <img src="/images/favourite-icon.png" />

                        <p>Add to favourites</p>
                    </div>
                </div>

                <div className="about-this-product">
                    <h3>About this product</h3>

                    <div className="about-content">
                        <div className="theos-row">
                            <p className="title">Condition</p>

                            <div className="radio-buttons">
                                <label>
                                    <p>New</p>

                                    <input
                                        type="radio"
                                        name="brand_new"
                                        value="yes"
                                        checked={brand_new === true}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </label>

                                <label>
                                    <p>Used</p>

                                    <input
                                        type="radio"
                                        name="brand_new"
                                        value="no"
                                        checked={brand_new === false}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="theos-row">
                            <p className="title">Quantity</p>

                            <input
                                type="text"
                                placeholder="Quantity"
                                className="text-and-number-inputs quantity-input"
                                defaultValue={product.stock_quantity}
                                onChange={(e) => handleInputChange(e)}
                                name="stock_quantity"
                            />
                        </div>

                        <div className="theos-row inaccessible">
                            <p className="title">Average Rating</p>

                            <p className="detail">{product.product_rating}</p>
                        </div>

                        <div className="theos-row inaccessible">
                            <p className="title">No. Of Reviews</p>

                            <p className="detail">{product.no_of_reviews}</p>
                        </div>
                    </div>
                </div>

                <div className="description">
                    <h3>Description</h3>

                    <div
                        contentEditable="true"
                        className="auto-growing-textarea"
                        onInput={(e) => handleDescriptionChange(e)}
                        suppressContentEditableWarning
                    >
                        {product.description}
                    </div>
                </div>

                <div className="other-details">
                    <h3>Other details</h3>


                    <div className="section">
                        <b>Categories</b>

                        <div className="categories">
                            {categories.map(category =>
                                <label key={category}>
                                    <p>{capitiliseString(category)}</p>

                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCheckboxChange(category)}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="section">
                        <b>Discount</b>

                        <input
                            type="number"
                            placeholder="If no discount, 0"
                            className="discount-input"
                            defaultValue={product.discount}
                            onChange={(e) => handleInputChange(e)}
                            name="discount"
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>Error 404: Product not found</div>
    )
}

export default EditProduct