import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IUser extends Document {
  first_name: string
  second_name: string
  email: string
  accessLevel: number
  password: string
  profile_picture: string
  house_address: string
  telephone_no: string
}

const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accessLevel: { type: Number, required: true },
    password: { type: String, required: true },
    profile_picture: { type: String, required: false },
    house_address: { type: String, required: false },
    telephone_no: { type: String, required: false }
  },
  {
    collection: 'users'
  }
)

const usersModel: Model<IUser> = mongoose.model<IUser>('users', usersSchema)

export default usersModel
