import React from "react"
import { useNavigate, Navigate } from "react-router-dom"

// hooks
import { useFetchFavourites } from "../../../hooks/favourites/useFetchFavourites"
import { useRemoveFavourite } from "../../../hooks/favourites/useRemoveFavourite"

// global constants 
import { ACCESS_LEVEL_ADMIN } from "../../../config/global_constants"

const Favourites: React.FC = () => {
    // Navigation
    const navigate = useNavigate()

    // Hook state variables
    const { favourites, loading, error, fetchFavourites } = useFetchFavourites(localStorage.id)
    const { favourites: updatedFavourites, loading: loadingUpdatedFavourites, removeFromFavourites } = useRemoveFavourite()

    // To delete a product from the favoruite table
    const removeAndUpdateFavourites = async (productId: string) => {
        try {
            await removeFromFavourites(localStorage.id, productId)

            await fetchFavourites() // Update products in favourites
        }
        catch {
            alert("Failed to delete product")
        }
    }

    // Users cannot access Favourites component
    const accessLevel = parseInt(localStorage.accessLevel)
    const isAdmin = accessLevel === ACCESS_LEVEL_ADMIN

    // Admins cannot see this page
    if(isAdmin) {
        return <Navigate to="/admin" replace />
    }

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
                {favourites && favourites.length > 0 ? (
                    favourites.map(favourite =>
                        <div className="product" key={favourite._id}>
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
                                    onClick={() => removeAndUpdateFavourites(favourite._id)}
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