import postsModel from "../models/posts_model";
import { Error, ObjectId } from "mongoose";
import { Request, Response } from "express";
import BaseController from "./base_controller";

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
}

export default new PostController(postsModel);
