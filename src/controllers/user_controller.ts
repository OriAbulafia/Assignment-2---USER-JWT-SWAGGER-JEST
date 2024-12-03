import { Request, Response } from "express";
import User from "../models/user_model.js";
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

const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.username);
    const email = await User.findById(req.params.email);
    if (!user && !email) {
      res.status(404).send("Not a valid parameter");
      return;
    }
    res.status(200).send(user ? user : email);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.username);
    if (!user) {
      res.status(404).send("Not a valid username");
      return;
    }
    const newUser = req.body;
    const update = await User.findByIdAndUpdate(req.params.username, newUser, {
      new: true,
    });
    res.status(200).send(update);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export { createUser, getAllUsers, getUserByUsername, updateUser };
