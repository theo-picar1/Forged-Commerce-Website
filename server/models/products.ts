import mongoose from 'mongoose'
const { Schema, model } = mongoose

export interface IProduct extends mongoose.Document {
  product_name: string
  product_rating: number
  no_of_reviews: number
  category: string[]
  description: string
  brand_new: boolean
  discount: number
  product_images: string[]
  price: number
  stock_quantity: number
  sold: number
}

const productsSchema = new Schema<IProduct>({
  product_name: { type: String, required: true },
  product_rating: { type: Number, required: true },
  no_of_reviews: { type: Number, required: true },
  category: { type: [String], required: true },
  description: { type: String, required: true },
  brand_new: { type: Boolean, required: true },
  discount: { type: Number, required: true },
  product_images: { type: [String], required: true },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, required: true },
  sold: { type: Number, required: true }
},
  {
    collection: 'products'
  }
)

const productsModel = model<IProduct>('Product', productsSchema)

export default productsModel