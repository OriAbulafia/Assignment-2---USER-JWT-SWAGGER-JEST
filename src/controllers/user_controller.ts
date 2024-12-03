import { Request, Response } from "express";
import User from "../models/user_model.js";
import Comments from "../models/comment_model.js";
import Posts from "../models/post_model.js";

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    if (user) {
      res.status(202).send(user);
    } else {
      res.status(404).send("User was not created");
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const filter = req.query;
  try {
    const users = filter.username
      ? await User.find({ username: filter.username })
      : await User.find();
    res.status(200).send(users);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("Not a valid parameter");
      return;
    }
    res.status(200).send(user);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("Not a valid username");
      return;
    }
    const newUser = req.body;
    const update = await User.findByIdAndUpdate(id, newUser, {
      new: true,
    });
    res.status(200).send(update);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const validId = await User.findById(userId);
    if (!validId) {
      res.status(400).send("User Id is not valid");
      return;
    }
    await Comments.deleteMany({ user: userId });
    await Posts.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
