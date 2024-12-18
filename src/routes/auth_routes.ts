import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.delete("/delete", authController.deleteUser);

export default router;
