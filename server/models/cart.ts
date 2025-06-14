import mongoose from 'mongoose'
const { Schema, model } = mongoose

interface CartProduct {
    product: mongoose.Types.ObjectId
    quantity: number
}

export interface ICart extends mongoose.Document {
    user: mongoose.Types.ObjectId
    products: CartProduct[]
    total_price: number
}

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    total_price: { type: Number }
}, {
    collection: 'cart'
})

const cartModel = model<ICart>('Cart', cartSchema)

export default cartModel
