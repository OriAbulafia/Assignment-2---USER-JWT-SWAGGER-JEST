import Comments from "../models/comment_model.js";
import Posts from "../models/post_model.js";
import mongoose from "mongoose";

const addComment = async (req, res) => {
    
    const { post,sender,message } = req.body;
    if (!mongoose.Types.ObjectId.isValid(post)) {
      return res.status(400).json({ error: "Invalid postId" });
    }
    try {
      const validPost = await Posts.findById(post);
      if (!validPost) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      const comment = new Comments({
        post,
        sender,
        message,
      });

      await comment.save();
      return res.status(201).json(comment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const getAllCommentsInAPost = async (req, res) => {
    const postId = req.query.post;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }
    try {
      const validPost = await Posts.findById(postId);
      if (!validPost) {
        return res.status(404).json({ error: "Post not found" });
      }

        const comments = await Comments.find({ post: postId });
        return res.status(200).json(comments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const getCommentById = async (req, res) => {
    const commentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }
    try {
      const comment = await Comments.findById(commentId);     
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      return res.status(200).json(comment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const updateComment = async (req, res) => {
    const {message} = req.body;
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }
    try {
        const comment = await Comments.findById(id);     
        if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
        }

        comment.message = message;
  
      await comment.save();
      return res.status(200).json(comment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const deleteComment = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }
    try {
      const comment = await Comments.findByIdAndDelete(id);
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  export { addComment, getAllCommentsInAPost, getCommentById, updateComment, deleteComment };