import express, { Router } from "express";
import {
  addComment,
  getAllCommentsInAPost,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comment_controller.js";

const router: Router = express.Router();

router.route("/").post(addComment);
router.route("/").get(getAllCommentsInAPost);
router.route("/:id").put(updateComment);
router.route("/:id").get(getCommentById);
router.route("/:id").delete(deleteComment);

export default router;
