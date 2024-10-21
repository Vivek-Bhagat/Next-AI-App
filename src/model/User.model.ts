import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
  content: string
  createdAt: Date // Ensures createdAt is correctly typed
  _id: string // Mongoose generates this automatically
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})

export interface User extends Document {
  username: string
  email: string
  password: string // Ensure this is hashed before saving
  verifyCode: string
  verifyCodeExpiry: Date
  isVerified: boolean
  isAcceptingMessages: boolean
  messages: Message[]
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true, // Automatically creates an index
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Automatically creates an index
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
})

// Handle duplicate model definition in development
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema)

export default UserModel
