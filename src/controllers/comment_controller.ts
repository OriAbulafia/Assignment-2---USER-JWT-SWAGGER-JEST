import Comments from "../models/comment_model.js";
import Posts from "../models/post_model.js";
import mongoose from "mongoose";
import { Request, Response } from "express"; // Import Express types

// Add a new comment to a post
const addComment = async (req: Request, res: Response): Promise<void> => {
  const { post, sender, message } = req.body;
  if (!mongoose.Types.ObjectId.isValid(post)) {
    res.status(400).json({ error: "Invalid postId" });
    return;
  }
  try {
    const validPost = await Posts.findById(post);
    if (!validPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const comment = new Comments({ post, sender, message });
    await comment.save();
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all comments for a specific post
const getAllCommentsInAPost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.query.post as string;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ error: "Invalid postId" });
    return;
  }
  try {
    const validPost = await Posts.findById(postId);
    if (!validPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const comments = await Comments.find({ post: postId });
    res.status(200).json(comments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a comment by its ID
const getCommentById = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ error: "Invalid commentId" });
    return;
  }
  try {
    const comment = await Comments.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.status(200).json(comment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update a comment by its ID
const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid commentId" });
    return;
  }
  try {
    const comment = await Comments.findById(id);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    comment.message = message;
    await comment.save();
    res.status(200).json(comment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment by its ID
const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid commentId" });
    return;
  }
  try {
    await Comments.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addComment,
  getAllCommentsInAPost,
  getCommentById,
  updateComment,
  deleteComment,
};
