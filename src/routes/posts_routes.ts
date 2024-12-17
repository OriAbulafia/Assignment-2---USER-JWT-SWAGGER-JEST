import express, { Request, Response, NextFunction } from "express";
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  postsController.getAll(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  postsController.getById(req, res);
});

router.post("/", authMiddleware, (req: Request, res: Response) => {
  postsController.createItem(req, res);
});

router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  postsController.updateItem(req, res);
});

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  postsController.deleteItem(req, res);
});

export default router;
