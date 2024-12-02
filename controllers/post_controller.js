import Posts from "../models/post_model.js";
import Comments from "../models/comment_model.js";
import mongoose from "mongoose";

const getAllPosts = async (req, res) => {
  const filter = req.query;
  try {
    if (filter.sender) {
      const posts = await Posts.find({ sender: filter.sender });
      return res.send(posts);
    } else {
      const posts = await Posts.find();
      return res.send(posts);
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const createPost = async (req, res) => {
  try {
    const post = await Posts.create(req.body);
    if (post) {
      return res.send(post);
    } else {
      return res.status(404).send("Post not created");
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const getPostById = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).send("Post id is invalid");
    }
    return res.status(200).send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).send("Post id is invalid");
    }
    const newPost = req.body;
    const update = await Posts.findByIdAndUpdate(id, newPost, { new: true });
    return res.status(200).send(update);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const validPost = await Posts.findById(postId);
    if (!validPost) {
      return res.status(404).send("Post id is invalid");
    }
    await Comments.deleteMany({ post: postId });
    await Posts.findByIdAndDelete(postId);
    return res.status(200).send("Post deleted successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export { createPost, updatePost, getAllPosts, getPostById, deletePost };
