import { Schema, model } from 'mongoose'

const favouriteSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
    rating: Number,
},
{
    collection: 'favourites'
})

export default model('favourites', favouriteSchema)