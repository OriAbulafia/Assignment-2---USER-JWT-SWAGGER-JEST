import mongoose from "mongoose";

export interface iComment {
  message: String;
  sender: String;
  post: mongoose.Schema.Types.ObjectId;
}

const commentsSchema = new mongoose.Schema<iComment>({
  message: {
    type: String,
    required: true,
  },
  sender: {
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
