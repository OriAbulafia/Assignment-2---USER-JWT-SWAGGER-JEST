import mongoose from "mongoose";

export interface iComment {
  user: mongoose.Schema.Types.ObjectId;
  message: String;
  post: mongoose.Schema.Types.ObjectId;
}

const commentsSchema = new mongoose.Schema<iComment>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const commentsModel = mongoose.model<iComment>("comments", commentsSchema);

export default commentsModel;
