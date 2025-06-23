import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Favourite } from "../types/Favourite"

interface FavouriteProps {
    userFavourites: Favourite | null
    removeFavourite: (productId: string) => void
}

const Favourites: React.FC<FavouriteProps> = ({
    userFavourites,
    removeFavourite
}) => {
    const navigate = useNavigate()

    return (
        <div className="favourites-page">
            <h3>Favourited Products</h3>

            <div className="filter-tools">
                <div className="filter-button">
                    <img src="/images/filter-icon.png" />

                    <p>Filters</p>
                </div>
            </div>

            <div className="favourited-products">
                {userFavourites && userFavourites.favourites.length > 0 ? (
                    userFavourites?.favourites.map(favourite =>
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

                                <button
                                    className="remove-from-favourites"
                                    onClick={() => removeFavourite(favourite._id)}
                                >Remove From Favourites</button>
                            </div>
                        </div>
                    )
                ) : (
                    <React.Fragment>
                        <h3 className="empty-message">You have no favourited products!</h3>

                        <button onClick={() => navigate('/')}>Head to products page</button>
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}

export default Favourites