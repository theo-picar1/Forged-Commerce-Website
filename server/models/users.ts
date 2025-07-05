import mongoose from 'mongoose'
const { Schema, model } = mongoose

export interface IUser extends mongoose.Document {
  firstName: string
  lastName: string
  email: string
  accessLevel: number
  password: string
  profile_picture: string
  houseAddress: string
  telephoneNo: string
}

const usersSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accessLevel: { type: Number, required: false },
  password: { type: String, required: true },
  profile_picture: { type: String, required: false, default: "" },
  houseAddress: { type: String, required: false },
  telephoneNo: { type: String, required: false }
},
  {
    collection: 'users'
  }
)

const usersModel = model<IUser>('User', usersSchema)

export default usersModel
