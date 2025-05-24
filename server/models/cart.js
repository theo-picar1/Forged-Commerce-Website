const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    purchased_at: Date,
    total_price: Number // or Number if you prefer
}, 
{
    collection: 'cart'
})

module.exports = mongoose.model('cart', cartSchema)