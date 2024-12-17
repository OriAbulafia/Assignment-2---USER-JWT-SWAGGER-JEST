import express, { Request, Response } from "express";
import { postsController } from "../controllers/posts_controller";

const router = express.Router();


router.get("/", (req: Request, res: Response) => {
    postsController.getAll(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
    postsController.getById(req, res);
});

router.post("/", (req: Request, res: Response) => {
    postsController.createItem(req, res);
});

router.put("/:id", (req: Request, res: Response) => {
    postsController.updateItem(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
    postsController.deleteItem(req, res);
});

export default router;
