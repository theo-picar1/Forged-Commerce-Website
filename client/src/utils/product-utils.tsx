// ********** For functions that are specifically related to 'Product' DB **********
import React, { JSX } from "react"

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

// Find images starting with passed in prefix
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