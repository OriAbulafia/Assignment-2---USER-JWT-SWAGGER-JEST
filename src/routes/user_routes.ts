import express, { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
} from "../controllers/user_controller.js";

const router: Router = express.Router();

router.route("/").post(createUser);
router.route("/all").get(getAllUsers);
router.route("/").get(getUserByUsername);
router.route("/").put(updateUser);

export default router;
