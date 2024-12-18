import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Posts from "../models/posts_model";
import commentModel from "../models/comments_model";

const register = async (req: Request, res: Response, next: Function) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("missing email or password");
    return;
  }

  if (await userModel.findOne({ email: email })) {
    res.status(400).send("email already exists");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    email: email,
    password: hashedPassword,
    refreshTokens: [],
  });

  res.status(200).send(user);
};

const generateTokens = (
  _id: string
): { accessToken: string; refreshToken: string } | null => {
  const random = Math.floor(Math.random() * 1000000);
  let accessToken = "";
  let refreshToken = "";
  if (process.env.TOKEN_SECRET) {
    accessToken = jwt.sign(
      {
        _id: _id,
        random: random,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    refreshToken = jwt.sign(
      {
        _id: _id,
        random: random,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
  }

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("wrong email or password");
    return;
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    res.status(400).send("wrong email or password");
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400).send("wrong email or password");
    return;
  }

  const userId: string = user._id.toString();
  const tokens = generateTokens(userId);

  if (tokens) {
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      email: user.email,
      _id: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
};

const logout = async (req: Request, res: Response, next: Function) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("missing refresh token");
    return;
  }

  if (process.env.TOKEN_SECRET) {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, data: any) => {
        if (err) {
          res.status(403).send("invalid token");
          return;
        }

        const payload = data as TokenPayload;

        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }

        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("invalid token");
          return;
        }

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        await user.save();

        res.status(200).send("logged out");
      }
    );
  }
};

const refresh = async (req: Request, res: Response, next: Function) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("invalid token");
    return;
  }

  if (process.env.TOKEN_SECRET) {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, data: any) => {
        if (err) {
          res.status(403).send("invalid token");
          return;
        }

        const payload = data as TokenPayload;
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }

        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("invalid token");
          return;
        }

        const newTokens = generateTokens(user._id.toString());
        if (newTokens) {
          user.refreshTokens = user.refreshTokens.filter(
            (token) => token !== refreshToken
          );

          user.refreshTokens.push(newTokens.refreshToken);
          await user.save();

          res.status(200).send({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });
        }
      }
    );
  }
};

type TokenPayload = {
  _id: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (process.env.TOKEN_SECRET) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }
      const payload = data as TokenPayload;
      req.query.userId = payload._id;
      next();
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const password = req.body.password;
  if (!userEmail || !password) {
    res.status(400).send("missing email or password");
    return;
  }
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    res.status(400).send("wrong email or password");
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400).send("wrong email or password");
    return;
  }
  await commentModel.deleteMany({ owner: user._id });

  await Posts.deleteMany({ owner: user._id });
  await userModel.deleteOne({ _id: user._id });
  res.status(200).send("user deleted");
};

export default { register, login, logout, refresh, deleteUser };
