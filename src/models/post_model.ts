import mongoose from "mongoose";

export interface iPost {
  sender: String,
  message: String,
}

const postSchema = new mongoose.Schema<iPost>({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model<iPost>("posts", postSchema);

export default postModel;