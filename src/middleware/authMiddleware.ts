import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { iUser } from "../models/user_model.js";
import asyncHandler from "express-async-handler";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: iUser & { _id: string }; // Include _id field
    }
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
}

const authUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"] as string | undefined;
    const refreshToken = req.cookies["refreshToken"] as string | undefined;

    if (!accessToken && !refreshToken) {
      res.status(401);
      throw new Error("A token is missing");
    }

    try {
      if (accessToken) {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN as string
        ) as DecodedToken;

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          res.status(404);
          throw new Error("User not found");
        }

        req.user = user.toObject() as iUser & { _id: string }; // Include _id in req.user
        return next();
      }
    } catch (err) {
      // Continue to check the refresh token.
    }

    if (!refreshToken) {
      res.status(401);
      throw new Error("Access Denied. No valid token provided.");
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN as string
      ) as DecodedToken;

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "1h" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      res.setHeader("Authorization", newAccessToken);

      res.status(200).send({
        success: true,
        token: true,
        message: "Refreshed token",
      });
    } catch (err) {
      res.status(401);
      throw new Error("Access Denied. Invalid refresh token.");
    }
  }
);

export { authUser };
