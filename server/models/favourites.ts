import mongoose from "mongoose"
const { Schema, model } = mongoose

export interface IFavourite extends mongoose.Document {
    userId: mongoose.Types.ObjectId
    favourites: mongoose.Types.ObjectId[]
}

const favouritesSchema = new Schema<IFavourite>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
},
    {
        collection: 'favourites'
    })

const favouritesModel = model<IFavourite>('Favourite', favouritesSchema)

export default favouritesModel