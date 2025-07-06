// ********** For functions that are specifically related to 'Product' DB **********
import React from "react"

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
export function createStarsForProduct(rating: number): React.JSX.Element[] {
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