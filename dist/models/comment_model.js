import mongoose from "mongoose";
const commentsSchema = new mongoose.Schema({
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
const commentsModel = mongoose.model("comments", commentsSchema);
export default commentsModel;
