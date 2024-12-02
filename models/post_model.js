import mongoose from "mongoose";

const postsSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Post", postsSchema);
