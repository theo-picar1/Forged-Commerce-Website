// ********** For functions that are specifically related to 'Product' DB **********
import React, { JSX } from "react"
import { Link } from "react-router-dom"

// types
import { Product } from "../types/Product"

// Function that will give a counter for each category and each product condition for the user to see
export function countCategoriesAndConditions(products: Product[]): Map<string, number> {
    let map = new Map<string, number>()

    products.forEach(product => {
        if (product.category && product.category.length > 0) {
            // For each category, give a counter for it for the user to see
            product.category.forEach(category => {
                map.set(category, (map.get(category) || 0) + 1)
            })
        }

        // INcrement used and new products for user too
        if ('brand_new' in product) {
            const condition = product.brand_new ? 'new' : 'used'
            map.set(condition, (map.get(condition) || 0) + 1)
        }
    })

    return map
}

// Function to just get the categories from every product in the DB
export function getCategories(products: Product[]): string[] {
    let categories: string[] = []

    products.forEach(product => {
        if (product.category && product.category.length > 0) {
            categories.push(...product.category) // Push each category in the product individually
        }
    })

    return categories
}

// For returning same amount as stars as the rating rounded down
export function createStarsForProduct(rating: number): JSX.Element[] {
    // Array runs rating.floored times
    return Array.from({ length: Math.floor(rating) }, (_, i) => (
        <img key={i} src="/images/filled-star-icon.png" alt="" />
    ))
}

// Get matching products based on selected categories, condition and other fields
export function getMatchingProducts(
    products: Product[],
    selectedCategories: string[],
    selectedConditions: string[],
    minRating: number,
    maxRating: number,
    minPrice: number,
    maxPrice: number
): Product[] {
    const filtered = products?.filter(product => {
        // If product has atleast 1 category that's selected or no categories selected, return true
        let matchedCategories = selectedCategories.length === 0 || selectedCategories.some(checkedValue =>
            product["category"].map(category => category.toLowerCase()).includes(checkedValue.toLowerCase())
        )

        let productCondition = product["brand_new"] === false ? "used" : "new"

        // If product has one of the selected conditionsor no conditions selected, return true
        let matchedConditions = selectedConditions.length === 0 || selectedConditions.some(checkedValue =>
            productCondition.toLowerCase() === checkedValue.toLowerCase()
        )

        // If price >= minRating and <= maxRating, return true
        let matchedRating = product["product_rating"] >= minRating && product["product_rating"] <= maxRating

        // Same thing
        let matchedPrice = product["price"] >= minPrice && product["price"] <= maxPrice

        // Only return the product that has some of the selected categories and has rating between given range
        return (matchedCategories && matchedRating && matchedPrice && matchedConditions)
    })

    return filtered;
}

// the little circles just below the product image depending on ow many images that product has
export function createImageIndexes(noOfImages: number): JSX.Element[] {
    return Array.from({ length: noOfImages }, (_, i) => (
        <div className="index" key={i}></div>
    ))
}

// To calculate discounted price and also return it rounded to two d.p
export function discountedPrice(price: number, discount: number): number {
    let originalPrice = price
    let convertedDiscount = discount / 100

    return Number((originalPrice - price * convertedDiscount).toFixed(2))
}

// Find products starting with passed in prefix for the searchbar autocomplete modal
export function findProductsWithPrefix(prefix: string, products: Product[]): Product[] {
    let matched: Product[] = []

    if (prefix !== "" && prefix.length > 0) {
        products.forEach(product => {
            if (product["product_name"].toLowerCase().startsWith(prefix.toLowerCase())) {
                matched.push(product)
            }
        })
    }

    return matched
}

// Function that just returns the general HTML format of the product card in 
export function createProductCard(product: Product) {
    return (
        <div className="product" key={product["_id"]}>
            <div className="product-image-container">
                <img src={product["product_images"][0]} alt="" />
            </div>

            <div className="product-details">
                <div className="product-name-container">
                    <Link to={`/product/${product._id}`} className="product-name">{product["product_name"]}</Link>
                </div>
                {product["discount"] > 0 ? (
                    <div className="discounted-price-container">
                        <p className="product-price">€{discountedPrice(product["price"], product["discount"])}</p>
                        <p className="original-price">€{product["price"]}</p>
                    </div>
                ) : <p className="product-price">€{product["price"]}</p>
                }
            </div>
        </div>
    )
}

// Findall products where the first category of the product is the same as product we're viewing
export function findSimilarProducts(products: Product[], currentProduct: Product | null): Product[] {
    let similar: Product[] = []

    products.forEach((p) => {
        if (p.category[0] === currentProduct?.category[0] && p._id !== currentProduct._id) {
            similar.push(p)
        }
    })

    return similar
}