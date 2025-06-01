import mongoose from 'mongoose'
const { Schema, model, Types } = mongoose

interface CartProduct {
    product: mongoose.Types.ObjectId
    quantity: number
}

export interface ICart extends mongoose.Document {
    user: mongoose.Types.ObjectId
    products: CartProduct[]
    purchased_at: Date
    total_price: number
}

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    purchased_at: { type: Date },
    total_price: { type: Number }
}, {
    collection: 'cart'
})

const cartModel = model<ICart>('cart', cartSchema)

export default cartModel
