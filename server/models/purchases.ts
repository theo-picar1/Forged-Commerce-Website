import mongoose from "mongoose"
const { Schema, model } = mongoose

interface ProductItem {
  product_name: string
  quantity: number
  price: number
  product_images: string[]
}

interface Purchases {
  items: ProductItem[]
  purchased_at: Date
  totalPrice: number
}

interface IPurchase extends mongoose.Document {
  user: mongoose.Types.ObjectId
  purchases: Purchases[]
}

const productItemSchema = new Schema<ProductItem>({
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  product_images: [{ type: String, required: true }]
})

const purchasesSchema = new Schema<IPurchase>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  purchases: [{
    items: [productItemSchema],
    purchased_at: { type: Date, required: true },
    totalPrice: { type: Number, required: true }
  }]
}, {
  collection: 'purchases'
})

const purchasesModel = model<IPurchase>('Purchase', purchasesSchema)

export default purchasesModel