import React, { ChangeEvent, Component, JSX } from "react"
import { Product } from "../types/Product"

type ViewProductState = {
    similarProducts: Product[]
    requestedQuantity: number
}

interface ViewProductsProps {
    productToView: Product
    products: Product[]
    setProductToView: (product: Product) => void
    addProductToCart: (product: Product) => void
}

// Prop has to come first as parameter for some reason
export default class ViewProduct extends Component<ViewProductsProps, ViewProductState> {
    constructor(props: ViewProductsProps) {
        super(props)

        this.state = {
            similarProducts: [],
            requestedQuantity: 1
        }
    }

    createImageIndexes(noOfImages: number): JSX.Element[] {
        return Array.from({ length: noOfImages }, (_, i) => (
            <div className="index" key={i}></div>
        ))
    }

    discountedPrice(price: number, discount: number) : number {
        let originalPrice = price
        let convertedDiscount = discount / 100

        return Number((originalPrice - (price * convertedDiscount)).toFixed(2))
    }

    findSimilarProducts() : void {
        let similar: Product[] = []

        this.props.products.map(product => {
            if (product["category"][0] === this.props.productToView["category"][0] && product["_id"] !== this.props.productToView["_id"]) {
                similar.push(product)
            }
        })

        this.setState({
            similarProducts: similar
        })
    }

    handleQuantityChange = (e: ChangeEvent<HTMLInputElement>): void => {
        // Making sure input passed is a number
        const quantity = Number(e.target.value)

        this.setState({
            requestedQuantity: quantity
        }, () => console.log(quantity))
    }

    componentDidMount(): void {
        this.findSimilarProducts()
    }

    render() {
        const { productToView, addProductToCart } = this.props
        const { similarProducts, requestedQuantity } = this.state

        return (
            <div className="view-product-page-container">
                <div className="image-carousel-container">
                    <div className="image-carousel">
                        <div className="image-container">
                            {productToView["product_images"].map((url, i) =>
                                <div key={i} style={{ backgroundImage: `url(${url})` }}></div>
                            )}
                        </div>
                    </div>

                    <div className="image-index">
                        {this.createImageIndexes(productToView["product_images"].length)}
                    </div>
                </div>

                <div className="product-details">
                    <h4>{productToView["product_name"]}</h4>

                    <div className="price-and-stock">
                        <h5>€{productToView["price"]}</h5>
                        <p>{productToView["stock_quantity"]} in stock</p>
                    </div>

                    <div className="product-quantity-container">
                        <p>Quantity</p>
                        <input type="number" min="1" max={productToView["stock_quantity"]} value={requestedQuantity} onChange={(e) => this.handleQuantityChange(e)}/>
                    </div>

                    <div className="buttons">
                        <button id="buy-now" className="button">Buy now</button>

                        <button id="add-to-basket" className="button" onClick={() => addProductToCart(productToView)}>Add to basket</button>

                        <div id="add-to-favourites" className="button">
                            <img src="/images/favourite-icon.png" />

                            <p>Add to favourites</p>
                        </div>
                    </div>

                    <div className="about-this-product">
                        <h3>About this product</h3>

                        <div className="about-content">
                            <div className="theos-row">
                                <p className="title">Condition</p>

                                <p>{productToView["brand_new"] ? "New" : "Used"}</p>
                            </div>

                            <div className="theos-row">
                                <p className="title">Quantity</p>

                                <div className="sold-and-stock">
                                    <p className="detail sold-detail">{productToView["sold"]} sold!</p>
                                    <p className="detail">{productToView["stock_quantity"]} left</p>
                                </div>
                            </div>

                            <div className="theos-row">
                                <p className="title">Average Rating</p>

                                <p className="detail">{productToView["product_rating"]} stars</p>
                            </div>

                            <div className="theos-row">
                                <p className="title">No. Of Reviews</p>

                                <p className="detail">{productToView["no_of_reviews"]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="description">
                        <h3>Description</h3>

                        {productToView["description"]}
                    </div>
                </div>

                <div className="similar-products">
                    <h3>Similar Products</h3>

                    <div className="products">
                        {similarProducts.length > 0 ? (
                            similarProducts.map(product =>
                                <div className="product" key={product["_id"]} onClick={() => {
                                    this.props.setProductToView(product)
                                    this.findSimilarProducts()
                                }}>
                                    <div className="product-image-container">
                                        <img src={product["product_images"][0]} alt="" />
                                    </div>

                                    <div className="product-details">
                                        <div className="product-name-container">
                                            <p className="product-name">{product["product_name"]}</p>
                                        </div>
                                        {product["discount"] > 0 ? (
                                            <div className="discounted-price-container">
                                                <p className="product-price">€{this.discountedPrice(product["price"], product["discount"])}</p>
                                                <p className="original-price">€{product["price"]}</p>
                                            </div>
                                        ) : <p className="product-price">€{product["price"]}</p>
                                        }
                                    </div>
                                </div>
                            )) : <p>No similar products</p>}
                    </div>
                </div>
            </div>
        )
    }
}