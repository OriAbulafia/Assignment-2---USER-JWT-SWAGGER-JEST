import mongoose from "mongoose";

export interface iPost {
  user: mongoose.Schema.Types.ObjectId;
  message: String;
}

const postSchema = new mongoose.Schema<iPost>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model<iPost>("Post", postSchema);

export default postModel;

// post: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Post",
//   required: true,
// },
