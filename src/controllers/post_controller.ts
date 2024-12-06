import Posts from "../models/post_model.js";
import Comments from "../models/comment_model.js";
import { Request, Response } from "express"; // Import Express types

// Fetch all posts or post by user
const getAllPosts = async (req: Request, res: Response) => {
  const userId = req.query.user as string;
  try {
    if (userId) {
      const posts = await Posts.find({ user: userId }).populate("user");
      console.log(posts);
      if (posts.length === 0) {
        res.status(404).send("No posts found for the given user");
        return;
      }
      res.status(200).send(posts);
      return;
    }
    const posts = await Posts.find().populate("user");
    console.log(posts);
    res.status(200).send(posts);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

// Create a new post
const createPost = async (req: Request, res: Response) => {
  try {
    const post = await Posts.create(req.body);
    if (post) {
      console.log(post);
      res.status(201).send(post);
    } else {
      res.status(404).send("Post not created");
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

// Get a post by ID
const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).send("Post id is invalid");
      return;
    }
    res.status(200).send(post);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

// Update a post by ID
const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).send("Post id is invalid");
      return;
    }
    const newPost = req.body;
    const update = await Posts.findByIdAndUpdate(id, newPost, { new: true });
    res.status(200).send(update);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

// Delete a post by ID
const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const validPost = await Posts.findById(postId);
    if (!validPost) {
      res.status(404).send("Post id is invalid");
      return;
    }
    await Comments.deleteMany({ post: postId });
    await Posts.findByIdAndDelete(postId);
    res.status(200).send("Post deleted successfully");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export { createPost, updatePost, getAllPosts, getPostById, deletePost };
