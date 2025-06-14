import mongoose from "mongoose"
const { Schema, model } = mongoose

interface Purchases {
  cart: mongoose.Types.ObjectId,
  purchased_at: Date
}

export interface IPurchase extends mongoose.Document {
  user: mongoose.Types.ObjectId
  purchases: Purchases[]
}

const purchasesSchema = new Schema<IPurchase>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  purchases: [{
    cart: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    purchased_at: { type: Date, required: true }
  }]
},
  {
    collection: 'purchases'
  }
)

const productsModel = model<IPurchase>('Purchase', purchasesSchema)

export default productsModel