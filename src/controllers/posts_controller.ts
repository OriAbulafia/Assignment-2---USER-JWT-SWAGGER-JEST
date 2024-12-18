import postsModel from "../models/posts_model";
import { Error, ObjectId } from "mongoose";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import commentModel from "../models/comments_model";

class PostController extends BaseController {
  constructor(model: any) {
    super(model);
  }

  async createItem(req: Request, res: Response) {
    const _id = req.query.userId;
    const post = {
      ...req.body,
      owner: _id,
    };
    req.body = post;
    return super.createItem(req, res);
  }

  async deleteItem(req: Request, res: Response) {
    const _id = req.params.id;
    await commentModel.deleteMany({ postId: _id });
    return super.deleteItem(req, res);
  }
}

export default new PostController(postsModel);
