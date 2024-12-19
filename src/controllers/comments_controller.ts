import commentsModel from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import Posts from "../models/posts_model";

class CommentsController extends BaseController
{
  constructor(model: any)
  {
    super(model);
  }

  async createItem(req: Request, res: Response)
  {
    const _id = req.query.userId;
    const comment = {
      ...req.body,
      owner: _id,
    };
    req.body = comment;
    return super.createItem(req, res);
  }

};

export default new CommentsController(commentsModel);
