import express, { Request, Response } from "express";
import {
  commentsController,
  getByPostId,
} from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  commentsController.getAll(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  commentsController.getById(req, res);
});

router.get("/post/:postId", (req: Request, res: Response) => {
  getByPostId(req, res);
});

router.post("/", authMiddleware, (req: Request, res: Response) => {
  commentsController.createItem(req, res);
});

router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  commentsController.updateItem(req, res);
});

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  commentsController.deleteItem(req, res);
});

export default router;