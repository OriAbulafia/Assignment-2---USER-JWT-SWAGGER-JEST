import commentsModel from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import Posts from "../models/posts_model";

const commentsController = new BaseController(commentsModel);

const getByPostId = async (req: Request, res: Response) => {
  const id = req.params.postId;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).send("Post id is invalid");
      return;
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};
export { commentsController, getByPostId };
