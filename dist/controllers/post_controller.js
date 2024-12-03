import Posts from "../models/post_model.js";
import Comments from "../models/comment_model.js";
// Fetch all posts with optional filter by sender
const getAllPosts = async (req, res) => {
    const filter = req.query;
    try {
        const posts = filter.sender
            ? await Posts.find({ sender: filter.sender })
            : await Posts.find();
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
};
// Create a new post
const createPost = async (req, res) => {
    try {
        const post = await Posts.create(req.body);
        if (post) {
            console.log("A BANANAAAA post was created");
            res.status(201).send(post);
        }
        else {
            res.status(404).send("Post not created");
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
};
// Get a post by ID
const getPostById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Posts.findById(id);
        if (!post) {
            res.status(404).send("Post id is invalid");
            return;
        }
        res.status(200).send(post);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
// Update a post by ID
const updatePost = async (req, res) => {
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
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
// Delete a post by ID
const deletePost = async (req, res) => {
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
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
export { createPost, updatePost, getAllPosts, getPostById, deletePost };
