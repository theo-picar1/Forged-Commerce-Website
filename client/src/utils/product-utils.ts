// ********** For functions that are specifically related to 'Product' DB **********

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
        if(product.category && product.category.length > 0) {
            categories.push(...product.category) // Push each category in the product individually
        }
    })

    return categories
}