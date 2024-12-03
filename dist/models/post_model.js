import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
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
const postModel = mongoose.model("posts", postSchema);
export default postModel;
// post: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Post",
//   required: true,
// },
