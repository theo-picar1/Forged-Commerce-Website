import React, { useState } from "react"

// types
import { Product } from "../../types/Product"

// functions
import { closeSlideInModal } from "../../utils/dom-utils"
import { capitiliseString } from "../../utils/string-utils"
import { getMatchingProducts } from "../../utils/product-utils.tsx"

// props
interface ProductFiltersProps{
    categories: string[]
    counterMap: Map<string, number>
    products: Product[]
    filterProducts: (products: Product[]) => void
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    categories,
    counterMap,
    products,
    filterProducts
}) => {
    // State variables
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(1000)
    const [minRating, setMinRating] = useState<number>(1)
    const [maxRating, setMaxRating] = useState<number>(5)
    const [selectedCategories, setCategories] = useState<string[]>([])
    const [selectedConditions, setCondition] = useState<string[]>([])

    // Handle min change while making sur it does not go over current set max price
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // Just to make sure that it is a number
        const inputValue = Number(e.target.value)

        // Ensure inputValue is a valid number before comparing
        if (!isNaN(inputValue)) {
            const newMin = Math.min(inputValue, maxPrice - 1)

            setMinPrice(newMin)
        }
    }

    // Handle max change while making sure it does not go below current set min price
    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const inputValue = Number(e.target.value)

        if (!isNaN(inputValue)) {
            const newMax = Math.max(inputValue, minPrice + 1)

            setMaxPrice(newMax)
        }
    }

    // Handle both min and max rating changes
    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name } = e.target
        let val: number = Number(e.target.value)

        switch (name) {
            case "minRating": 
                setMinRating(val); 
                break
            case "maxRating": 
                setMaxRating(val); 
                break
        }
    }

    // Handle all selected checkboxes
    const handleCategoryChange = (category: string): void => {
        // Conditionally handle whether or not to remove the category from array or add it
        setCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    // Handle condition type for product
    const handleConditionChange = (condition: string): void => {
        // Conditionally handle whether or not to remove the condition from array or add it
        setCondition(prev => 
            prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
        )
    }

    // When triggered, update state of filteredProducts
    function applyFilters(): void {
        // Filter out products using imported function
        const filtered = getMatchingProducts(
            products, 
            selectedCategories, 
            selectedConditions, 
            minRating, 
            maxRating, 
            minPrice, 
            maxPrice
        )

        filterProducts(filtered) // Update the state in parent
    }

    return (
        <div className="slide-in-modal" id="advanced-product-filters-modal">
            <div className="slide-in-modal-content" id="advanced-product-filters-modal-content">
                <header>
                    <h5>Filters</h5>

                    <img src="/images/close-icon.png" alt="Close button icon" onClick={() => closeSlideInModal("advanced-product-filters-modal")} />
                </header>

                <main>
                    <div className="section">
                        <div className="title">
                            <h5>Categories</h5>
                        </div>

                        <div className="content">
                            {categories.map(category =>
                                <div className="checkbox-container" key={category}>
                                    <label key={category}>
                                        <input 
                                            type="checkbox" 
                                            value={category} 
                                            onChange={() => handleCategoryChange(category)} 
                                            className="checkbox" 
                                        />

                                        <p>{capitiliseString(category)}</p>
                                    </label>

                                    <p>{counterMap.get(category)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="section">
                        <div className="title">
                            <h5>Price (€)</h5>
                        </div>

                        <div className="content">
                            <div className="min-max-inputs-container">
                                <label className="min">
                                    <p>Min</p>

                                    <input 
                                        type="number" 
                                        id="min-price-value" 
                                        autoComplete="off" 
                                        min="0" 
                                        value={minPrice} 
                                        onChange={(e) => handleMinChange(e)} />
                                </label>

                                <p className="dash">-</p>

                                <label className="max">
                                    <p>Max</p>

                                    <input 
                                        type="number" 
                                        id="max-price-value" 
                                        max="1000" 
                                        autoComplete="on" 
                                        value={maxPrice} 
                                        onChange={(e) => handleMaxChange(e)} />
                                </label>
                            </div>

                            {/* Slider with double thumbs made by ChatGPT */}
                            <div className="slider-container">
                                <div className="slider">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={minPrice}
                                        onChange={(e) => handleMinChange(e)}
                                        className="thumb thumb-left"
                                    />

                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={maxPrice}
                                        onChange={(e) => handleMaxChange(e)}
                                        className="thumb thumb-right"
                                    />

                                    <div className="slider-track" />

                                    <div
                                        className="slider-range"
                                        style={{
                                            left: `${(minPrice / 1000) * 100}%`,
                                            width: `${((maxPrice - minPrice) / 1000) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="title">
                            <h5>Rating</h5>
                        </div>

                        <div className="content">
                            <div className="min-max-inputs-container">
                                <label className="min">
                                    <p>Min</p>

                                    <input 
                                        type="number" 
                                        name="minRating" 
                                        id="min-rating-value" 
                                        autoComplete="off" 
                                        min="0" 
                                        max={maxRating} 
                                        value={minRating} 
                                        onChange={handleRatingChange} />
                                </label>

                                <p className="dash">-</p>

                                <label className="max">
                                    <p>Max</p>

                                    <input 
                                        type="number" 
                                        name="maxRating" 
                                        id="max-rating-value" 
                                        min={minRating} 
                                        max="5" 
                                        autoComplete="off"
                                        value={maxRating} 
                                        onChange={handleRatingChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="title">
                            <h5>Condition</h5>
                        </div>

                        <div className="content">
                            <div className="checkbox-container">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="new" 
                                        className="checkbox" 
                                        onChange={() => handleConditionChange("new")} 
                                    />

                                    <p>New</p>
                                </label>

                                <p>{counterMap.get("new")}</p>
                            </div>

                            <div className="checkbox-container">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="used" 
                                        className="checkbox" 
                                        onChange={() => handleConditionChange("used")} 
                                    />

                                    <p>Used</p>
                                </label>

                                <p>{counterMap.get("used")}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer>
                    <div id="clear-all-filters-button">
                        <p>Clear All</p>
                    </div>

                    <div id="apply-filters-button" onClick={() => {
                        closeSlideInModal("advanced-product-filters-modal")
                        applyFilters()
                    }}>
                        <p>Apply Filters</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ProductFilters