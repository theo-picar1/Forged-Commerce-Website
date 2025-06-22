import React, { useState, useEffect } from "react"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Favourite } from "../types/Favourite"

const Favourites: React.FC = () => {
    const [userFavourites, setFavourites] = useState<Favourite | null>(null)

    useEffect(() => {
        const fetchFavourites = async (): Promise<void> => {
            try {
                const res = await axios.get<Favourite>(`${SERVER_HOST}/favourites/${localStorage.id}`)

                if (!res) {
                    console.log("Unable to fetch products")

                    return
                }

                setFavourites(res.data)
            }
            catch(error: any) {
                if(error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }
            }
        }

        fetchFavourites()
    }, [])

    return (
        <div className="favourites-page">
            <h3>Favourited Products</h3>

            <div className="filter-tools">
                {/* <div className="searchbar-container">
                    <div className="search-button">
                        <img src="/images/search-icon.png" />
                    </div>

                    <input 
                        type="text" 
                        placeholder="Search for products"
                    />
                </div> */}

                <div className="filters-container">
                    <div className="filter-button">
                        <img src="/images/filter-icon.png" />

                        <p>Filters</p>
                    </div>

                    <select>
                        <option>Placeholder</option>
                    </select>
                </div>
            </div>

            <div className="favourited-products">
                {userFavourites?.favourites.map(favourite => 
                    <div className="product">
                        <div className="images-container">
                            <div className="images-scroll-container">
                                {favourite.product_images.map(image =>
                                    <img src={image} className="image" />
                                )}
                            </div>
                        </div>

                        <div className="product-details">
                            <div className="left">
                                <p className="name">{favourite.product_name}</p>

                                <p className="price">€{favourite.price}</p>
                            </div>

                            <div className="right">
                                <p className="saved-at">Saved on:</p>

                                <p className="save-date">00/00/0000</p>
                            </div>
                        </div>

                        <div className="buttons">
                            <button className="buy-now">Buy Now</button>

                            <button className="add-to-cart">Add To Cart</button>

                            <button className="remove-from-favourites">Remove From Favourites</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favourites