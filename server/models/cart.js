import { Schema, model } from 'mongoose'

const cartSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
                quantity: { type: Number, default: 1, min: 1 }
            }
        ],
        purchased_at: Date,
        total_price: Number // or Number if you prefer
    },
    {
        collection: 'cart'
    })

export default model('cart', cartSchema)