const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    rating: Number,
},
{
    collection: 'favourites'
})

module.exports = mongoose.model('favourites', favouriteSchema)