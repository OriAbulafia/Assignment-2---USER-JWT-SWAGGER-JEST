import express, { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user_controller.js";

const router: Router = express.Router();

router.route("/").post(createUser);
router.route("/").get(getAllUsers);
router.route("/:id").put(updateUser);
router.route("/:id").get(getUserById);
router.route("/:id").delete(deleteUser);

export default router;
