import express, { Router } from "express";
import {
  updateUser,
  deleteUser,
  refreshToken,
  login,
  register,
} from "../controllers/user_controller.js";
import { authUser } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refreshToken);
router.route("/").put(authUser, updateUser);
router.route("/").delete(authUser, deleteUser);

export default router;
