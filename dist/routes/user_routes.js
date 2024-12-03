import express from "express";
import { createUser } from "../controllers/user_controller";
const router = express.Router();
router.route("/").post(createUser);
export default router;
