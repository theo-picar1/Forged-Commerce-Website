import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"

// types
import { Product } from "../../../types/Product.ts"

// axios 
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../../../config/global_constants.ts"

// functions
import { openSlideInModal } from "../../../utils/dom-utils.ts"
import { createStarsForProduct } from "../../../utils/product-utils.tsx"

// components
import ProductFilters from "../../modals/ProductFilters.tsx"
import AddProduct from "../../modals/AddProduct.tsx"

// hooks
import { useFetchProductsWithPrefix } from "../../../hooks/products/useFetchProductsWithPrefix.tsx"
import { useDeleteProduct } from "../../../hooks/products/useDeleteProduct.tsx"
import { useAddProduct } from "../../../hooks/products/useAddProduct.tsx"

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
    // URL Params
    const { prefix } = useParams<{ prefix?: string }>()
    const searchPrefix = prefix?.trim() || "" // Fallback for if prefix is undefined

    // State variables
    const [filteredProducts, setFiltered] = useState<Product[]>([])

    // Hooks 
    const { products, loading, error, refetch } = useFetchProductsWithPrefix(searchPrefix)
    const { loading: loadingDelete, deleteProduct } = useDeleteProduct()
    const { loading: loadingAdd, addToProducts } = useAddProduct()

    // Keep copy of original products every time it changes
    useEffect(() => {
        setFiltered(products)
    }, [loading, products])

    // Delete product by id with hook and refetch upadated DB
    const deleteAndUpdateProducts = async (id: string) => {
        try {
            await deleteProduct(id)

            await refetch()

            alert("Successfully deleted product")
        }
        catch (error) {
            console.error("Failed to delete and update products: ", error)
        }
    }

    // Add product from AddProduct and update products
    const addAndUpdateProducts = async (formData: FormData): Promise<void> => {
        try {
            await addToProducts(formData)

            await refetch() // Update products state

            console.log("Successfully added product")
        }
        catch (error) {
            console.error("Failed to add product: ", error)
        }
    }

    // Update filteredProducts when applying filters in ProductFilters
    const filterProducts = (products: Product[]) => {
        setFiltered(products)
    }

    return (
        <div className="products-page-container">
            {loading ? (
                <div className="onmount-message">
                    <p>Loading products...</p>
                </div>
            ) : error ? (
                <div className="onmount-message">
                    <p>An error has occured. Please refresh the page</p>
                </div>
            ) : (
                <React.Fragment>
                    <AddProduct
                        categories={categories}
                        addAndUpdateProducts={addAndUpdateProducts}
                    />

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
                        <div id="products-section">
                            {filteredProducts.map(product => (
                                <div className="product" key={product._id}>
                                    <Link to={`/product/${product._id}`} className="product-image-container">
                                        {product.product_images && product.product_images.length > 0 ? (
                                            <img
                                                id="product-image"
                                                src={
                                                    product.product_images[0].startsWith('http://') ||
                                                        product.product_images[0].startsWith('https://')
                                                        ? product.product_images[0]
                                                        : `${SERVER_HOST}/uploads/${product.product_images[0]}`
                                                }
                                            />
                                        ) : (
                                            <img
                                                id="product-image"
                                                src="/images/app-logo.png"
                                            />
                                        )}
                                    </Link>

                                    <div className="product-details">
                                        <p className="product-name">{product.product_name}</p>

                                        <div className="product-rating">
                                            {createStarsForProduct(product.product_rating)}
                                            <p>{product.no_of_reviews}</p>
                                        </div>

                                        {product.stock_quantity < 15 && (
                                            <p className="stock-notice">Only {product.stock_quantity} left!</p>
                                        )}

                                        <div className="product-bottom-section">
                                            <p>€{product.price}</p>

                                            {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                                                <div
                                                    className="add-to-shopping-cart-button"
                                                    onClick={() => addProductToCart(product)}
                                                >
                                                    <img src="/images/shopping-cart.png" alt="Add to shopping cart button" />
                                                </div>
                                            ) : (
                                                <div className="admin-tools">
                                                    <Link to={`/edit-product/${product._id}`} className="button">
                                                        <img src="/images/edit-icon.png" className="edit-icon" />
                                                    </Link>

                                                    <div className="button" onClick={() => deleteAndUpdateProducts(product._id)} >
                                                        <img src="/images/bin-icon.png" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-matching-products-message">
                            <p>No matching products. Please refine your search!</p>
                        </div>
                    )}

                </React.Fragment>
            )}
        </div>
    )
}

export default Products