import mongoose from "mongoose";

const commentScheme = mongoose.Schema({
    message: {
        type:String,
        required:true
    },
    sender: {
        type:String,
        required:true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
})

export default mongoose.model("Comment", commentScheme)