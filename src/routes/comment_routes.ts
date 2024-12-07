import express, { Router } from "express";
import {
  addComment,
  getAllCommentsInAPost,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comment_controller.js";
import { authUser } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

router.route("/").post(authUser, addComment);
router.route("/").get(getAllCommentsInAPost);
router.route("/:id").put(authUser, updateComment);
router.route("/:id").get(getCommentById);
router.route("/:id").delete(authUser, deleteComment);

export default router;
