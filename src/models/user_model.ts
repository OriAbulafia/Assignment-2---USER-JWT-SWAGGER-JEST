import mongoose, { Document, Schema } from "mongoose";

// Interface defining user data structure
export interface iUser {
  username: string;
  password: string;
  email: string;
}

// Interface for Mongoose Document with user data
export interface iUserDocument extends Document, iUser {}

const userSchema = new Schema<iUserDocument>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

// Create and export the model using IUserDocument
const userModel = mongoose.model<iUserDocument>("User", userSchema);

export default userModel;
