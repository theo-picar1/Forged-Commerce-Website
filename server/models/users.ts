import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  accessLevel: number
  password: string
  profile_picture: string
  houseAddress: string
  telephoneNo: string
}

const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accessLevel: { type: Number, required: false },
    password: { type: String, required: true },
    profile_picture: { type: String, required: false },
    houseAddress: { type: String, required: false },
    telephoneNo: { type: String, required: false }
  },
  {
    collection: 'users'
  }
)

const usersModel: Model<IUser> = mongoose.model<IUser>('users', usersSchema)

export default usersModel
