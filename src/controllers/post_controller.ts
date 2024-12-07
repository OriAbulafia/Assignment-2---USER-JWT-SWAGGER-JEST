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
    // Ensure the authUser middleware has attached the user to the request
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { message } = req.body;

    // Validate the message field
    if (!message || typeof message !== "string") {
      res.status(400).send("Message is required and must be a string");
      return;
    }

    // Create the post
    const post = await Posts.create({
      user: req.user._id, // Use authenticated user's ID
      message,
    });

    res.status(201).send(post);
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
  try {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { id } = req.params;
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      res.status(400).send("Message is required and must be a string");
      return;
    }

    // Find the post and ensure it belongs to the logged-in user
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403).send("Forbidden: You can only update your own posts");
      return;
    }

    // Update the post
    post.message = message;
    await post.save();

    res.status(200).send(post);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

// Delete a post by ID
const deletePost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { id } = req.params;

    // Find the post and ensure it belongs to the logged-in user
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403).send("Forbidden: You can only delete your own posts");
      return;
    }

    // Delete the post and associated comments
    await Comments.deleteMany({ post: id });
    await Posts.findByIdAndDelete(id);

    res.status(200).send("Post deleted successfully");
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export { createPost, updatePost, getAllPosts, getPostById, deletePost };
