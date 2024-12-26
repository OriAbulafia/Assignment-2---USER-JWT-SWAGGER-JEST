import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.put("/update", authMiddleware, (req: Request, res: Response) => {
  authController.updateUser(req, res);
});

router.delete("/delete", authMiddleware, (req: Request, res: Response) => {
  authController.deleteUser(req, res);
});

export default router;
