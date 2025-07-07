import React, { useState, useEffect, JSX } from "react"
import { Link } from "react-router-dom"

// types
import { Product } from "../../../types/Product.ts"

// axios 
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../../../config/global_constants.ts"
import axios from "axios"

// functions
import { openSlideInModal } from "../../../utils/dom-utils.ts"
import { createStarsForProduct } from "../../../utils/product-utils.tsx"

// components
import ProductFilters from "../../modals/ProductFilters.tsx"

// Interface is for the props being passed to this component
interface ProductsProps {
    categories: string[]
    counterMap: Map<string, number>
    addProductToCart: (product: Product) => void
}

const Products: React.FC<ProductsProps> = ({
    categories,
    counterMap,
    addProductToCart
}) => {
    // State variables
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFiltered] = useState<Product[]>([])

    // Fetch products from the database again for filtering and crud operations
    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const res = await axios.get(`${SERVER_HOST}/products`)

                if(!res || !res.data) {
                    console.log(res.data.errorMessage)
                }
                else {
                    setProducts(res.data)
                    setFiltered(res.data)
                }

                return
            }
            catch(error: any) {
                if(error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }

                return
            }
        }

        fetchProducts()
    }, [])

    // Function to delete one single product by its id 
    const deleteProduct = async (id: string): Promise<void> => {
        try {
            const res = await axios.delete(`${SERVER_HOST}/products/${id}`)         
            
            if(!res || !res.data) {
                alert(res.data.errorMessage)
            }
            else {
                alert(res.data.message)
            }

            return
        }
        catch(error: any) {
            if(error.response.data.errorMessage) {
                console.error(error.response.data.errorMessage)
            }
            else {
                console.error(error)
            }
        }
    }

    // Update filteredProducts when applying filters in ProductFilters
    const filterProducts = (products: Product[]) => {
        setFiltered(products)
    }

    return (
        <div className="products-page-container">
            <ProductFilters 
                categories={categories}
                counterMap={counterMap}
                products={products}
                filterProducts={filterProducts}
            />

            {localStorage.accessLevel == ACCESS_LEVEL_ADMIN ? (
                <div className="admin-tools">
                    <button onClick={() => openSlideInModal("add-product-modal")}>
                        <p>Add product</p>
                    </button>

                    <button>
                        <p>Delete products</p>
                    </button>
                </div>
            ) : null}

            <div className="filter-tools">
                <div className="left">
                    <div className="filter-button" onClick={() => openSlideInModal("advanced-product-filters-modal")}>
                        <img src="/images/filter-icon.png" alt="Filter icon button" />

                        <p>Filters</p>
                    </div>
                </div>

                <div className="right">
                    <select>
                        <option>Newest Products</option>
                    </select>

                    {/* {currentView === "grid" && (
                        <img src="/images/list-icon.png" alt="Change to list view icon" onClick={() => {
                            switchProductViewImage("list")
                        }} />
                    )}

                    {currentView === "list" && (
                        <img src="/images/grid-icon.png" alt="Change to grid view icon" onClick={() => {
                            switchProductViewImage("grid")
                        }} />
                    )} */}
                </div>
            </div>

            {filteredProducts && filteredProducts.length > 0 ? (
                <main id="products-section">
                    {filteredProducts?.map(product =>
                        <div className="product" key={product._id}>
                            <Link to={`/product/${product._id}`} className="product-image-container">
                                <img
                                    id="product-image"
                                    src={
                                        // Check if URL was copy and pasted from the web
                                        product.product_images[0].startsWith('http://') ||
                                            product.product_images[0].startsWith('https://')
                                            ? product.product_images[0]
                                            : `${SERVER_HOST}/uploads/${product.product_images[0]}`
                                    }
                                />
                            </Link>


                            <div className="product-details">
                                <p className="product-name">{product["product_name"]}</p>

                                <div className="product-rating">
                                    {createStarsForProduct(product["product_rating"])}

                                    <p>{product["no_of_reviews"]}</p>
                                </div>

                                {product["stock_quantity"] < 15 ? (
                                    <p className="stock-notice">Only {product["stock_quantity"]} left!</p>
                                ) : null
                                }

                                <div className="product-bottom-section">
                                    <p>€{product["price"]}</p>

                                    {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                                        <div className="add-to-shopping-cart-button" onClick={() => addProductToCart(product)}>
                                            <img src="/images/shopping-cart.png" alt="Add to shopping cart button" />
                                        </div>
                                    ) : (
                                        <div className="admin-tools">
                                            <Link to={`/edit-product/${product._id}`} className="button">
                                                <img src="/images/edit-icon.png" className="edit-icon" />
                                            </Link>

                                            <div className="button" onClick={() => deleteProduct(product._id)}>
                                                <img src="/images/bin-icon.png" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            ) : (
                <h3 className="no-matching-products">No results. Please adjust your selected changes</h3>
            )}
        </div>
    )
}

export default Products