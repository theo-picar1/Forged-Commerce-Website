const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    rating: Number,
},
{
    collection: 'reviews'
})

module.exports = mongoose.model('reviews', reviewSchema)