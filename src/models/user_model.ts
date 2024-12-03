import mongoose from "mongoose";
export interface iUser {
  username: String;
  password: String;
  email: String;
}

const userSchema = new mongoose.Schema<iUser>({
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

const userModel = mongoose.model<iUser>("users", userSchema);

export default userModel;
