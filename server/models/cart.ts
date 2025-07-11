import mongoose from 'mongoose'
const { Schema, model } = mongoose

interface CartProduct {
    product: mongoose.Types.ObjectId
    quantity: number
}

export interface ICart extends mongoose.Document {
    user: mongoose.Types.ObjectId
    savedProducts: CartProduct[]
}

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    savedProducts: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ]
}, {
    collection: 'cart'
})

const cartModel = model<ICart>('Cart', cartSchema)

export default cartModel
