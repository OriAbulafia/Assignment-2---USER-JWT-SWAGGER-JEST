import asyncHandler from "express-async-handler";
import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import Post from "../models/post_model.js";
import Comment from "../models/comment_model.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

interface ITokenPayload {
  id: string;
}

const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, username } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("Please provide name, email, password and username");
  }
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    email,
  });
  res.json({
    success: true,
    user: {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    },
  });
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username } = req.body;
  if (!username || !email) {
    res.status(400);
    throw new Error("Please provide email and username");
  }
  if (email !== req.user?.email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  }
  if (username !== req.user?.username) {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      throw new Error("Username already exists");
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      email,
      username,
    },
    { new: true }
  );
  res.json({
    success: true,
    user: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  let promises = [];
  promises.push(User.findByIdAndDelete(req.user?._id));
  promises.push(Post.deleteMany({ user: req.user?._id }));
  promises.push(Comment.deleteMany({ user: req.user?._id }));
  await Promise.all(promises);
  res.json({
    success: true,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN as string,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN as string,
    {
      expiresIn: "30d",
    }
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .header("Authorization", accessToken);
  res.json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
  });
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    res.status(400);
    throw new Error("No refresh token provided.");
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN as string
    ) as ITokenPayload;
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "1h",
      }
    );

    res.header("Authorization", accessToken);
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Token failed");
  }
});

export { register, updateUser, deleteUser, login, refreshToken };

// import { Request, Response } from "express";
// import User from "../models/user_model.js";
// import Comments from "../models/comment_model.js";
// import Posts from "../models/post_model.js";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.create(req.body);
//     if (user) {
//       res.status(202).send(user);
//     } else {
//       res.status(404).send("User was not created");
//     }
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// };

// const getAllUsers = async (req: Request, res: Response) => {
//   const filter = req.query;
//   try {
//     const users = filter.username
//       ? await User.find({ username: filter.username })
//       : await User.find();
//     res.status(200).send(users);
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// };

// const getUserById = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       res.status(404).send("Not a valid parameter");
//       return;
//     }
//     res.status(200).send(user);
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// };

// const updateUser = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       res.status(404).send("Not a valid username");
//       return;
//     }
//     const newUser = req.body;
//     const update = await User.findByIdAndUpdate(id, newUser, {
//       new: true,
//     });
//     res.status(200).send(update);
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// };

// const deleteUser = async (req: Request, res: Response) => {
//   const userId = req.params.id;
//   try {
//     const validId = await User.findById(userId);
//     if (!validId) {
//       res.status(400).send("User Id is not valid");
//       return;
//     }
//     await Comments.deleteMany({ user: userId });
//     await Posts.deleteMany({ user: userId });
//     await User.findByIdAndDelete(userId);
//     res.status(200).send("User deleted successfully");
//   } catch (err: any) {
//     res.status(400).send(err.message);
//   }
// };

// export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
