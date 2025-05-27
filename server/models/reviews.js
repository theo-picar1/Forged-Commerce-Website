import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
    rating: Number,
},
{
    collection: 'reviews'
})

export default model('reviews', reviewSchema)