import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
const postModel = mongoose.model("posts", postSchema);
export default postModel;
