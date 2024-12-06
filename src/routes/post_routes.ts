import express, { Router } from "express";
import {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../controllers/post_controller.js";
import { authUser } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

router.route("/").post(authUser, createPost);
router.route("/").get(getAllPosts);
router.route("/:id").put(authUser, updatePost);
router.route("/:id").get(getPostById);
router.route("/:id").delete(authUser, deletePost);

export default router;
