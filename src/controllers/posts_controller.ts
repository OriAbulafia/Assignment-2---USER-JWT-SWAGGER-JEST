import postsModel from "../models/posts_model";
import BaseController from "./base_controller";

const postsController = new BaseController(postsModel);

export { postsController };