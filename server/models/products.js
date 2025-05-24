const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    product_name: String,
    product_rating: Number,
    no_of_reviews: Number,
    category: [String],
    description: String,
    brand_new: Boolean,
    discount: Number,
    product_images: [String],
    price: Number,
    stock_quantity: Number,
    sold: Number
},
{
    collection: 'products'
})

module.exports = mongoose.model('products', productsSchema)
